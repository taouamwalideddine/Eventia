import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { ReservationsModule } from './reservations/reservations.module';
import { PdfModule } from './pdf/pdf.module';
import { User } from './users/entities/user.entity';
import { Event } from './events/entities/event.entity';
import { Reservation } from './reservations/entities/reservation.entity';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbType = configService.get('DB_TYPE', 'postgres');
        
        if (dbType === 'sqlite') {
          return {
            type: 'sqlite',
            database: configService.get('DB_DATABASE'),
            entities: [User, Event, Reservation],
            synchronize: false,
          };
        }
        
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [User, Event, Reservation],
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    EventsModule,
    ReservationsModule,
    PdfModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
