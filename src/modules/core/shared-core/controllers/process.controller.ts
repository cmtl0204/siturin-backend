import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth, User } from '@auth/decorators';
import { ResponseHttpInterface } from '@utils/interfaces';
import { ProcessService } from '@modules/core/shared-core/services/process.service';
import { CreateStep1Dto, CreateStep2Dto } from '@modules/core/shared-core/dto/process';
import { CreateInspectionDto } from '@modules/core/shared-core/dto/process/create-inspection.dto';
import { UserEntity } from '@auth/entities';

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

  @ApiOperation({ summary: 'Create External Inspection' })
  @Post('external-inspections')
  async createExternalInspection(
    @Body() payload: CreateInspectionDto,
    @User() user: UserEntity,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.createExternalInspection(payload, user);

    return {
      data: serviceResponse,
      message: `Estimado Usuario, le recordamos que en la inspección se verificará el cumplimiento de todos los requisitos declarados y la normativa vigente. Le notificaremos a su correo electrónico registrado, la hora y fecha de inspección, nuestro horario de atención es de lunes a viernes de 08h00 a 16h30`,
      title: `Se agendó correctamente`,
    };
  }

  @ApiOperation({ summary: 'Create Internal Inspection' })
  @Post('internal-inspections')
  async createInternalInspection(
    @Body() payload: CreateInspectionDto,
    @User() user: UserEntity,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.createInternalInspection(payload, user);

    return {
      data: serviceResponse,
      message: `Por favor revise la fecha generada`,
      title: `Se agendó correctamente`,
    };
  }
}
