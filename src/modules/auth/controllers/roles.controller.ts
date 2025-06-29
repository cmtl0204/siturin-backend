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
import { Auth } from '@auth/decorators';
import { CreateRoleDto, FilterRoleDto, UpdateRoleDto } from '@auth/dto';
import { RoleEntity } from '@auth/entities';
import { ResponseHttpInterface } from '../../../utils/interfaces';
import { RolesService } from '@auth/services/roles.service';

@ApiTags('Roles')
@Auth()
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @ApiOperation({ summary: 'Create One' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CreateRoleDto): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.rolesService.create(payload);

    return {
      data: serviceResponse.data,
      message: 'Role created',
      title: 'Created',
    };
  }

  @ApiOperation({ summary: 'Catalogue' })
  @Get('catalogue')
  @HttpCode(HttpStatus.OK)
  async catalogue(): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.rolesService.catalogue();

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `catalogue`,
      title: `Catalogue`,
    };
  }

  @ApiOperation({ summary: 'Find All' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() params: FilterRoleDto): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.rolesService.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `index`,
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Find One' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.rolesService.findOne(id);

    return {
      data: serviceResponse.data,
      message: `show ${id}`,
      title: `Success`,
    };
  }

  @ApiOperation({ summary: 'Update One' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateRoleDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.rolesService.update(id, payload);

    return {
      data: serviceResponse.data,
      message: `Role updated ${id}`,
      title: `Updated`,
    };
  }

  @ApiOperation({ summary: 'Remove One' })
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.rolesService.remove(id);

    return {
      data: serviceResponse.data,
      message: `Role deleted ${id}`,
      title: `Deleted`,
    };
  }

  @ApiOperation({ summary: 'Remove All' })
  @Patch('remove-all')
  @HttpCode(HttpStatus.CREATED)
  async removeAll(@Body() payload: RoleEntity[]): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.rolesService.removeAll(payload);

    return {
      data: serviceResponse.data,
      message: `Roles deleted`,
      title: `Deleted`,
    };
  }
}
