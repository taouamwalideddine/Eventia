
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PdfService } from './src/pdf/services/pdf.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const pdfService = app.get(PdfService);

    console.log('--- PDF Debug Script Start ---');
    try {
        // Try with ID 1 as seen in user error
        console.log('Attempting to generate PDF for reservation #1...');
        const buffer = await pdfService.generateTicket(1);
        console.log('PDF generated successfully! Buffer length:', buffer.length);
    } catch (error) {
        console.error('PDF Generation Failed!');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        if (error.stack) {
            console.error('Stack Trace:', error.stack);
        }
    }
    await app.close();
    console.log('--- PDF Debug Script End ---');
}

bootstrap();
