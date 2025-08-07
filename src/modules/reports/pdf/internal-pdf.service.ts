import { Inject, Injectable } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { ConfigType } from '@nestjs/config';
import { config } from '@config';
import { InternalPdfSql } from '@modules/reports/pdf/internal-pdf.sql';
import { registerCertificateReport } from '@modules/reports/pdf/templates/internals/register-certificate.report';

@Injectable()
export class InternalPdfService {
  constructor(
    private readonly internalPdfSql: InternalPdfSql,
    private readonly printerService: PrinterService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}

  async generateUsersReportBuffer() {
    const data: any = await this.internalPdfSql.findUsers();
    // console.log(data);
    try {
      return await this.printerService.createPdfBuffer(registerCertificateReport(data));
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }

  async generateRegisterCertificate({
    type = 'buffer',
    cadastreId,
  }: {
    type?: string;
    cadastreId: string;
  }): Promise<PDFKit.PDFDocument | Buffer> {
    const data: any = await this.internalPdfSql.findRegisterCertificate(cadastreId);

    try {
      if (type === 'buffer')
        return this.printerService.createPdfBuffer(registerCertificateReport(data));
      else return this.printerService.createPdf(registerCertificateReport(data));
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }
}
