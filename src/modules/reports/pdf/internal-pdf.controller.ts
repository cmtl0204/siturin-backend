import { Controller, Get, Header, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { InternalPdfService } from '@modules/reports/pdf/internal-pdf.service';
import { PublicRoute } from '@auth/decorators';

@ApiTags('Internal PDF Reports')
@Controller('reports/pdf/internals')
export class InternalPdfController {
  constructor(private readonly internalPdfService: InternalPdfService) {}

  @PublicRoute()
  @Header('Content-Type', 'application/pdf')
  @Get('users2')
  async generateUsersReport2(@Res() response: Response) {
    const pdfDoc = await this.internalPdfService.generateUsersReport();

    pdfDoc.info.Title = 'Users Report';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @PublicRoute()
  @Header('Content-Type', 'application/pdf')
  @Get('register-certificates')
  async generateRegisterCertificate(@Res() response: Response) {
    const pdfDoc = await this.internalPdfService.generateUsersReport2();

    pdfDoc.info.Title = 'Users Report';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @PublicRoute()
  @Get('users')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'inline; filename=users-report.pdf') // o "attachment;"
  async generateUsersReport() {
    return await this.internalPdfService.generateUsersReportBuffer();
  }
}
