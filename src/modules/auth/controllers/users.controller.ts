import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, FilterUserDto, UpdateUserDto } from '@auth/dto';
import { UserEntity } from '@auth/entities';
import { ResponseHttpInterface } from '@utils/interfaces';
import { Auth, PublicRoute } from '@auth/decorators';
import { RoleEnum } from '@auth/enums';
import { UsersService } from '../services/users.service';

@Auth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Create One' })
  @PublicRoute()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CreateUserDto): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.usersService.create(payload);

    return {
      data: serviceResponse,
      message: 'User created',
      title: 'Created',
    };
  }

  @ApiOperation({ summary: 'Catalogue' })
  @Get('catalogue')
  async catalogue(): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.usersService.catalogue();

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `catalogue`,
      title: `Catalogue`,
    };
  }

  @ApiOperation({ summary: 'Find All' })
  @Auth(RoleEnum.ADMIN)
  @Get()
  async findAll(@Query() params: FilterUserDto): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.usersService.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `index`,
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Find One' })
  @Auth()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.usersService.findOne(id);

    return {
      data: serviceResponse,
      message: `show ${id}`,
      title: `Success`,
    };
  }

  @ApiOperation({ summary: 'Update One' })
  @Auth()
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateUserDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.usersService.update(id, payload);

    return {
      data: serviceResponse,
      message: `Usuario actualizado`,
      title: `Actualizado`,
    };
  }

  @ApiOperation({ summary: 'Reactivate' })
  @Auth()
  @Put(':id/reactivate')
  async reactivate(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.usersService.reactivate(id);

    return {
      data: serviceResponse,
      message: `Usuario reactivado`,
      title: `Reactivado`,
    };
  }

  @ApiOperation({ summary: 'Remove One' })
  @Auth()
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.usersService.remove(id);

    return {
      data: serviceResponse,
      message: `Usuario eliminado`,
      title: `Eliminado`,
    };
  }

  @ApiOperation({ summary: 'Remove All' })
  @Auth()
  @Patch('remove-all')
  async removeAll(@Body() payload: UserEntity[]): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.usersService.removeAll(payload);

    return {
      data: serviceResponse,
      message: `Users deleted`,
      title: `Deleted`,
    };
  }

  @ApiOperation({ summary: 'Suspend One' })
  @Auth()
  @Put(':id/suspend')
  async suspend(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.usersService.suspend(id);

    return {
      data: serviceResponse,
      message: `Usuario suspendido`,
      title: `Suspendido`,
    };
  }
}
