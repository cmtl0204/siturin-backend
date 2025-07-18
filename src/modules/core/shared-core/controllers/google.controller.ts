import { Controller, Get, Query } from '@nestjs/common';
import { GoogleService } from '@modules/core/shared-core/services/google.service';

@Controller('core/shared/google')
export class GoogleController {
  constructor(private readonly sheetsService: GoogleService) {}

  @Get()
  async getData() {
    return {
      data: await this.sheetsService.getSheetData(),
      title: '',
      detail: '',
    };
  }
}
