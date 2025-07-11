import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '@auth/decorators';
import { ResponseHttpInterface } from '@utils/interfaces';
import { ProcessService } from '@modules/core/shared-core/services/process.service';
import { CreateStep1Dto, CreateStep2Dto } from '@modules/core/shared-core/dto/process';

@ApiTags('Processes')
@Auth()
@Controller('core/shared/processes')
export class ProcessesController {
  constructor(private service: ProcessService) {}

  @ApiOperation({ summary: 'Create Step 1' })
  @Post('step1')
  async createStep1(@Body() payload: CreateStep1Dto): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.createStep1(payload);

    return {
      data: serviceResponse,
      message: `Registro Creado`,
      title: `Creado`,
    };
  }

  @ApiOperation({ summary: 'Create Step 2' })
  @Post('step2')
  async createStep2(@Body() payload: CreateStep2Dto): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.createStep2(payload);

    return {
      data: serviceResponse,
      message: `Registro Creado`,
      title: `Creado`,
    };
  }
}
