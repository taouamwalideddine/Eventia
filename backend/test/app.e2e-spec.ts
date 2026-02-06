import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { Event } from '../src/events/entities/event.entity';
import { Reservation } from '../src/reservations/entities/reservation.entity';
import { JwtService } from '@nestjs/jwt';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let eventRepository: Repository<Event>;
  let reservationRepository: Repository<Reservation>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    eventRepository = moduleFixture.get<Repository<Event>>(getRepositoryToken(Event));
    reservationRepository = moduleFixture.get<Repository<Reservation>>(getRepositoryToken(Reservation));
    jwtService = moduleFixture.get<JwtService>(JwtService);

    await app.init();
  });

  afterEach(async () => {
    await userRepository.clear();
    await eventRepository.clear();
    await reservationRepository.clear();
    await app.close();
  });

  describe('Authentication', () => {
    it('POST /auth/register - should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user.email).toBe(userData.email);
    });

    it('POST /auth/login - should authenticate user', async () => {
      const user = await userRepository.save({
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Test User',
        role: 'PARTICIPANT',
      });

      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
    });

    it('POST /auth/login - should reject invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(401);
    });
  });

  describe('Events Management', () => {
    let adminToken: string;

    beforeEach(async () => {
      const admin = await userRepository.save({
        email: 'admin@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Admin User',
        role: 'ADMIN',
      });

      adminToken = jwtService.sign({ userId: admin.id, email: admin.email, role: admin.role });
    });

    it('POST /events - should create new event (admin only)', async () => {
      const eventData = {
        title: 'Test Event',
        description: 'Test Description',
        date: '2026-02-10T10:00:00Z',
        location: 'Test Location',
        capacity: 100,
        price: 50,
      };

      const response = await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(eventData)
        .expect(201);

      expect(response.body.title).toBe(eventData.title);
      expect(response.body.status).toBe('DRAFT');
    });

    it('GET /events - should return all published events', async () => {
      await eventRepository.save([
        {
          title: 'Published Event',
          description: 'Description',
          date: new Date(),
          location: 'Location',
          capacity: 100,
          price: 50,
          status: 'PUBLISHED',
        },
        {
          title: 'Draft Event',
          description: 'Description',
          date: new Date(),
          location: 'Location',
          capacity: 100,
          price: 50,
          status: 'DRAFT',
        },
      ]);

      const response = await request(app.getHttpServer())
        .get('/events')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Published Event');
    });

    it('GET /events/:id - should return event details', async () => {
      const event = await eventRepository.save({
        title: 'Test Event',
        description: 'Description',
        date: new Date(),
        location: 'Location',
        capacity: 100,
        price: 50,
        status: 'PUBLISHED',
      });

      const response = await request(app.getHttpServer())
        .get(`/events/${event.id}`)
        .expect(200);

      expect(response.body.id).toBe(event.id);
      expect(response.body.title).toBe(event.title);
    });
  });

  describe('Reservations', () => {
    let userToken: string;
    let adminToken: string;
    let testEvent: Event;

    beforeEach(async () => {
      const user = await userRepository.save({
        email: 'user@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Test User',
        role: 'PARTICIPANT',
      });

      const admin = await userRepository.save({
        email: 'admin@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Admin User',
        role: 'ADMIN',
      });

      userToken = jwtService.sign({ userId: user.id, email: user.email, role: user.role });
      adminToken = jwtService.sign({ userId: admin.id, email: admin.email, role: admin.role });

      testEvent = await eventRepository.save({
        title: 'Test Event',
        description: 'Description',
        date: new Date(),
        location: 'Location',
        capacity: 100,
        price: 50,
        status: 'PUBLISHED',
      });
    });

    it('POST /reservations - should create reservation', async () => {
      const reservationData = {
        eventId: testEvent.id,
        quantity: 2,
      };

      const response = await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${userToken}`)
        .send(reservationData)
        .expect(201);

      expect(response.body.eventId).toBe(testEvent.id);
      expect(response.body.quantity).toBe(2);
      expect(response.body.status).toBe('PENDING');
    });

    it('GET /reservations/my - should return user reservations', async () => {
      await reservationRepository.save({
        userId: 1,
        eventId: testEvent.id,
        quantity: 2,
        status: 'PENDING',
      });

      const response = await request(app.getHttpServer())
        .get('/reservations/my')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
    });

    it('PATCH /reservations/:id/confirm - should confirm reservation (admin only)', async () => {
      const reservation = await reservationRepository.save({
        userId: 1,
        eventId: testEvent.id,
        quantity: 2,
        status: 'PENDING',
      });

      const response = await request(app.getHttpServer())
        .patch(`/reservations/${reservation.id}/confirm`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.status).toBe('CONFIRMED');
    });
  });

  describe('PDF Generation', () => {
    let userToken: string;
    let confirmedReservation: Reservation;

    beforeEach(async () => {
      const user = await userRepository.save({
        email: 'user@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Test User',
        role: 'PARTICIPANT',
      });

      const event = await eventRepository.save({
        title: 'Test Event',
        description: 'Description',
        date: new Date(),
        location: 'Location',
        capacity: 100,
        price: 50,
        status: 'PUBLISHED',
      });

      confirmedReservation = await reservationRepository.save({
        userId: user.id,
        eventId: event.id,
        quantity: 2,
        status: 'CONFIRMED',
      });

      userToken = jwtService.sign({ userId: user.id, email: user.email, role: user.role });
    });

    it('GET /pdf/tickets/:id - should generate PDF for confirmed reservation', async () => {
      const response = await request(app.getHttpServer())
        .get(`/pdf/tickets/${confirmedReservation.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.headers['content-type']).toBe('application/pdf');
    });

    it('GET /pdf/tickets/:id - should reject PDF for pending reservation', async () => {
      const pendingReservation = await reservationRepository.save({
        userId: 1,
        eventId: 1,
        quantity: 2,
        status: 'PENDING',
      });

      await request(app.getHttpServer())
        .get(`/pdf/tickets/${pendingReservation.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);
    });
  });
});
