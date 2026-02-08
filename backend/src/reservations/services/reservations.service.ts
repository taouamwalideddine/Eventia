import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Reservation } from '../entities/reservation.entity';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { ReservationStatus } from '../../common/enums/reservation-status.enum';
import { EventStatus } from '../../common/enums/event-status.enum';
import { EventsService } from '../../events/services/events.service';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    private eventsService: EventsService,
    private usersService: UsersService,
    private dataSource: DataSource,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: number): Promise<Reservation> {
    return await this.dataSource.transaction(async manager => {
      const event = await this.eventsService.findPublished(createReservationDto.eventId);
      
      if (event.status !== EventStatus.PUBLISHED) {
        throw new BadRequestException('Cannot book a non-published event');
      }

      const existingReservation = await manager.findOne(Reservation, {
        where: {
          userId,
          eventId: createReservationDto.eventId,
          status: ReservationStatus.PENDING,
        },
      });

      if (existingReservation) {
        throw new ConflictException('You already have a pending reservation for this event');
      }

      const confirmedReservationsCount = await manager.count(Reservation, {
        where: {
          eventId: createReservationDto.eventId,
          status: ReservationStatus.CONFIRMED,
        },
      });

      const totalReserved = confirmedReservationsCount + createReservationDto.quantity;
      
      if (totalReserved > event.capacity) {
        throw new BadRequestException('Event capacity would be exceeded');
      }

      const reservation = manager.create(Reservation, {
        ...createReservationDto,
        userId,
        status: ReservationStatus.PENDING,
      });

      return manager.save(reservation);
    });
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationsRepository.find({
      relations: ['user', 'event'],
    });
  }

  async findByUser(userId: number): Promise<Reservation[]> {
    return this.reservationsRepository.find({
      where: { userId },
      relations: ['event'],
    });
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
      relations: ['user', 'event'],
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }

  async confirm(id: number): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException('Only pending reservations can be confirmed');
    }

    return await this.dataSource.transaction(async manager => {
      const event = await this.eventsService.findOne(reservation.eventId);
      
      const confirmedReservationsCount = await manager.count(Reservation, {
        where: {
          eventId: reservation.eventId,
          status: ReservationStatus.CONFIRMED,
        },
      });

      const totalReserved = confirmedReservationsCount + reservation.quantity;
      
      if (totalReserved > event.capacity) {
        throw new BadRequestException('Event capacity would be exceeded');
      }

      reservation.status = ReservationStatus.CONFIRMED;
      return manager.save(reservation);
    });
  }

  async refuse(id: number): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException('Only pending reservations can be refused');
    }

    reservation.status = ReservationStatus.REFUSED;
    return this.reservationsRepository.save(reservation);
  }

  async cancel(id: number, userId: number): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.userId !== userId) {
      throw new BadRequestException('You can only cancel your own reservations');
    }

    if (reservation.status === ReservationStatus.CANCELED) {
      throw new BadRequestException('Reservation is already canceled');
    }

    reservation.status = ReservationStatus.CANCELED;
    return this.reservationsRepository.save(reservation);
  }

  async getAvailableCapacity(eventId: number): Promise<number> {
    const event = await this.eventsService.findPublished(eventId);
    
    const confirmedReservationsCount = await this.reservationsRepository.count({
      where: {
        eventId,
        status: ReservationStatus.CONFIRMED,
      },
    });

    return event.capacity - confirmedReservationsCount;
  }
}
