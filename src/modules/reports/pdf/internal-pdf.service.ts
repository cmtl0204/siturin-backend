import { Inject, Injectable } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { ConfigType } from '@nestjs/config';
import { config } from '@config';
import { InternalPdfSql } from '@modules/reports/pdf/internal-pdf.sql';
import { usersReport } from '@modules/reports/pdf/templates/internals/users.report';
import { registerCertificateReport } from '@modules/reports/pdf/templates/internals/register-certificate.report';

@Injectable()
export class InternalPdfService {
  constructor(
    private readonly internalPdfSql: InternalPdfSql,
    private readonly printerService: PrinterService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}

  async generateUsersReport() {
    const data: any = await this.internalPdfSql.findRegulationResults('1234567890001');

    try {
      return this.printerService.createPdf(usersReport(data));
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }

  async generateUsersReport2() {
    const data: any = await this.internalPdfSql.findRegulationResults('1234567890001');

    try {
      return this.printerService.createPdf(registerCertificateReport(data));
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }

  async generateUsersReportBuffer() {
    const data: any = await this.internalPdfSql.findUsers();
    // console.log(data);
    try {
      return await this.printerService.createPdfBuffer(usersReport(data));
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }
}
