import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ReservationsService } from '../../reservations/services/reservations.service';
import * as PDFDocument from 'pdfkit';
import { ReservationStatus } from '../../common/enums/reservation-status.enum';

@Injectable()
export class PdfService {
  constructor(private reservationsService: ReservationsService) { }

  async generateTicket(reservationId: number): Promise<Buffer> {
    const reservation = await this.reservationsService.findOne(reservationId);

    if (!reservation) {
      throw new NotFoundException(`Reservation #${reservationId} not found`);
    }

    if (reservation.status !== ReservationStatus.CONFIRMED) {
      throw new BadRequestException('PDF ticket can only be generated for confirmed reservations');
    }

    if (!reservation.event) {
      throw new InternalServerErrorException(`Event data missing for reservation #${reservationId}`);
    }

    return new Promise((resolve, reject) => {
      try {
        const doc = new (PDFDocument as any)();
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err) => {
          console.error('PDF Doc Error:', err);
          reject(err);
        });

        // Add content to PDF
        doc.fontSize(20).text('Eventia Digital Ticket', { align: 'center' });
        doc.moveDown();

        const eventDate = reservation.event.date ? new Date(reservation.event.date).toLocaleDateString() : 'N/A';

        doc.fontSize(14).text(`Reservation ID: ${reservation.id}`);
        doc.text(`Event: ${reservation.event.title || 'Unknown Event'}`);
        doc.text(`Date: ${eventDate}`);
        doc.text(`Location: ${reservation.event.location || 'N/A'}`);
        doc.text(`Quantity: ${reservation.quantity}`);
        doc.text(`Status: ${reservation.status}`);
        doc.text(`Booked by: ${reservation.user?.name || 'Unknown User'}`);
        doc.text(`Email: ${reservation.user?.email || 'N/A'}`);

        doc.moveDown();
        doc.fontSize(12).text('Scan this ticket at the event entrance.', { align: 'center' });
        doc.text('Verification ID: ' + Math.random().toString(36).substring(7).toUpperCase(), { align: 'center', color: 'grey' });

        doc.end();
      } catch (err) {
        console.error('PDF Generation Exception:', err);
        reject(err);
      }
    });
  }
}
