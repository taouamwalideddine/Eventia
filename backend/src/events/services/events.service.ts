import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { EventStatus } from '../../common/enums/event-status.enum';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) { }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventsRepository.create({
      ...createEventDto,
      status: EventStatus.DRAFT,
    });
    return this.eventsRepository.save(event);
  }

  async findAll(): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { status: EventStatus.PUBLISHED },
      order: {
        date: 'ASC',
      },
    });
  }

  async findAllAdmin(): Promise<Event[]> {
    return this.eventsRepository.find({
      order: {
        date: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async findPublished(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id, status: EventStatus.PUBLISHED },
    });

    if (!event) {
      throw new NotFoundException('Published event not found');
    }

    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

    if (event.status === EventStatus.PUBLISHED) {
      throw new BadRequestException('Cannot update a published event');
    }

    if (event.status === EventStatus.CANCELED) {
      throw new BadRequestException('Cannot update a canceled event');
    }

    Object.assign(event, updateEventDto);
    return this.eventsRepository.save(event);
  }

  async publish(id: number): Promise<Event> {
    const event = await this.findOne(id);

    if (event.status !== EventStatus.DRAFT) {
      throw new BadRequestException('Only draft events can be published');
    }

    event.status = EventStatus.PUBLISHED;
    return this.eventsRepository.save(event);
  }

  async cancel(id: number): Promise<Event> {
    const event = await this.findOne(id);

    if (event.status === EventStatus.CANCELED) {
      throw new BadRequestException('Event is already canceled');
    }

    event.status = EventStatus.CANCELED;
    return this.eventsRepository.save(event);
  }

  async remove(id: number): Promise<void> {
    const event = await this.findOne(id);
    await this.eventsRepository.remove(event);
  }
}
