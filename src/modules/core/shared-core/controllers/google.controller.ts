import { Controller, Get, Query } from '@nestjs/common';
import { GoogleService } from '@modules/core/shared-core/services/google.service';

@Controller('core/shared/google')
export class GoogleController {
  constructor(private readonly sheetsService: GoogleService) {}

  @Get()
  async getData(@Query('spreadsheetId') spreadsheetId: string, @Query('range') range: string) {
    return {
      data: await this.sheetsService.getSheetData(spreadsheetId, range),
      title: '',
      detail: '',
    };
  }
}
