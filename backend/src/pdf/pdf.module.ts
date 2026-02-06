import { Module } from '@nestjs/common';
import { PdfService } from './services/pdf.service';
import { PdfController } from './pdf.controller';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports: [ReservationsModule],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}
