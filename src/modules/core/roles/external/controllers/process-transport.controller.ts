import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CataloguesService } from '@modules/common/catalogue/catalogue.service';

@ApiTags('DAC Process Transport')
@Controller('core/dac/process-transports')
export class ProcessTransportController {
  constructor(private catalogueService: CataloguesService) {}

  @ApiOperation({ summary: 'List all Cadastre' })
  @Get('')
  @HttpCode(HttpStatus.OK)
  catalogue() {
    return {
      data: null,
      message: `DAC`,
      title: `DAC`,
    };
  }
}
