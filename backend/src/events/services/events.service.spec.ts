import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { Event } from '../entities/event.entity';
import { EventStatus } from '../../common/enums/event-status.enum';

const mockEventRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
};

describe('EventsService', () => {
    let service: EventsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventsService,
                {
                    provide: getRepositoryToken(Event),
                    useValue: mockEventRepository,
                },
            ],
        }).compile();

        service = module.get<EventsService>(EventsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new event', async () => {
            const createEventDto = {
                title: 'Test Event',
                description: 'Test Description',
                date: new Date(),
                location: 'Test Location',
                capacity: 100,
                price: 10,
            };

            const expectedEvent = {
                id: 1,
                ...createEventDto,
                status: EventStatus.DRAFT,
            };

            mockEventRepository.create.mockReturnValue(expectedEvent);
            mockEventRepository.save.mockResolvedValue(expectedEvent);

            const result = await service.create(createEventDto as any); // cast for simplicity in test

            expect(mockEventRepository.create).toHaveBeenCalledWith({
                ...createEventDto,
                status: EventStatus.DRAFT,
            });
            expect(result).toEqual(expectedEvent);
        });
    });

    describe('findAll', () => {
        it('should return an array of published events sorted by date', async () => {
            const expectedEvents = [
                { id: 1, status: EventStatus.PUBLISHED, date: new Date() },
            ];

            mockEventRepository.find.mockResolvedValue(expectedEvents);

            const result = await service.findAll();

            expect(mockEventRepository.find).toHaveBeenCalledWith({
                where: { status: EventStatus.PUBLISHED },
                order: { date: 'ASC' },
            });
            expect(result).toEqual(expectedEvents);
        });
    });
});
