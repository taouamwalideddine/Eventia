import { Controller, Get, Param, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './services/pdf.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('ticket/:reservationId')
  @UseGuards(JwtAuthGuard)
  async generateTicket(
    @Param('reservationId') reservationId: string,
    @Res() res: Response,
  ) {
    try {
      const pdfBuffer = await this.pdfService.generateTicket(reservationId);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=ticket-${reservationId}.pdf`,
        'Content-Length': pdfBuffer.length,
      });

      res.status(HttpStatus.OK).send(pdfBuffer);
    } catch (error) {
      throw error;
    }
  }
}
