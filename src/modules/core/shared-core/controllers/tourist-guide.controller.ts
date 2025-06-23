import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth, PublicRoute } from '@auth/decorators';
import { ResponseHttpInterface } from '@utils/interfaces';
import { PaginationDto } from '@utils/dto';
import { TouristGuideService } from '@modules/core/shared-core/services/tourist-guide.service';
import {
  CreateTouristGuideDto,
  FindTouristGuideDto,
  UpdateTouristGuideDto,
} from '@modules/core/shared-core/dto/tourist-guide';

@ApiTags('Tourist Guide')
@Auth()
@Controller('core/shared/tourist-guides')
export class TouristGuideController {
  constructor(private service: TouristGuideService) {}

  @PublicRoute()
  @ApiOperation({ summary: 'Find All' })
  @Get()
  async findAll(@Query() params: PaginationDto): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `Registros Consultados`,
      title: `Consultados`,
    };
  }

  @ApiOperation({ summary: 'Find One' })
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() options: FindTouristGuideDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.findOne(id, options);

    return {
      data: serviceResponse,
      message: `Registro Consultado`,
      title: `Consultado`,
    };
  }

  @ApiOperation({ summary: 'Create' })
  @Post()
  async create(@Body() payload: CreateTouristGuideDto): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.create(payload);

    return {
      data: serviceResponse,
      message: `Registro Creado`,
      title: `Creado`,
    };
  }

  @ApiOperation({ summary: 'Update' })
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateTouristGuideDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.update(id, payload);

    return {
      data: serviceResponse,
      message: `Registro Actualizado`,
      title: `Actualizado`,
    };
  }

  @ApiOperation({ summary: 'Delete' })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.delete(id);

    return {
      data: serviceResponse,
      message: `Registro Eliminado`,
      title: `Eliminado`,
    };
  }
}
