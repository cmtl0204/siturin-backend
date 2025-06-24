import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth, PublicRoute } from '@auth/decorators';
import { ResponseHttpInterface } from '@utils/interfaces';
import { FilterUserDto } from '@auth/dto';
import { UsersService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '@auth/dto';

@ApiTags('Users')
@Auth()
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @ApiOperation({ summary: 'List all Users' })
  @Get()
  async findAll(
    @Query() params: FilterUserDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: 'Usuarios consultados',
      title: 'Consultados',
    };
  }

  @ApiOperation({ summary: 'Get one User' })
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.findOne(id);

    return {
      data: serviceResponse,
      message: 'Usuario consultado',
      title: 'Consultado',
    };
  }

  @ApiOperation({ summary: 'Create User' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @PublicRoute() //borrar esta linea
  async create(
    @Body() payload: CreateUserDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.create(payload);

    return {
      data: serviceResponse,
      message: 'Usuario creado',
      title: 'Creado',
    };
  }

  @ApiOperation({ summary: 'Update User' })
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateUserDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.update(id, payload);

    return {
      data: serviceResponse,
      message: 'Usuario actualizado',
      title: 'Actualizado',
    };
  }

  @ApiOperation({ summary: 'Delete User' })
  @Delete(':id')
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.service.remove(id);

    return {
      data: serviceResponse,
      message: 'Usuario eliminado',
      title: 'Eliminado',
    };
  }
}
