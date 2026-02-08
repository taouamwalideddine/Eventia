import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ReservationsService } from '../../reservations/services/reservations.service';
import PDFDocument from 'pdfkit';
import { ReservationStatus } from '../../common/enums/reservation-status.enum';

@Injectable()
export class PdfService {
  constructor(private reservationsService: ReservationsService) { }

  async generateTicket(reservationId: number): Promise<Buffer> {
    const reservation = await this.reservationsService.findOne(reservationId);

    if (reservation.status !== ReservationStatus.CONFIRMED) {
      throw new BadRequestException('PDF ticket can only be generated for confirmed reservations');
    }

    return new Promise((resolve) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Add content to PDF
      doc.fontSize(20).text('Event Ticket', { align: 'center' });
      doc.moveDown();

      doc.fontSize(14).text(`Reservation ID: ${reservation.id}`);
      doc.text(`Event: ${reservation.event.title}`);
      doc.text(`Date: ${new Date(reservation.event.eventDate).toLocaleDateString()}`);
      doc.text(`Location: ${reservation.event.location}`);
      doc.text(`Quantity: ${reservation.quantity}`);
      doc.text(`Status: ${reservation.status}`);
      doc.text(`Booked by: ${reservation.user.name}`);
      doc.text(`Email: ${reservation.user.email}`);

      doc.moveDown();
      doc.fontSize(12).text('Please present this ticket at the event entrance.', { align: 'center' });

      doc.end();
    });
  }
}
