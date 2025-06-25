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
import { CreateRoleDto, FilterRoleDto, UpdateRoleDto } from '@auth/dto';
import { RoleEntity } from '@auth/entities';
import { Auth, PublicRoute } from '@auth/decorators';
import { ResponseHttpInterface } from '../../../utils/interfaces';
import { RolesService } from '@auth/services/roles.service';

//@PublicRoute() //para todos los metodos
@Auth()
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @PublicRoute() //borrar esta parte
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo rol' })
  async create(@Body() payload: CreateRoleDto): Promise<ResponseHttpInterface> {
    const { data } = await this.rolesService.create(payload);
    return {
      data,
      message: 'Rol creado correctamente.',
      title: 'Creación exitosa',
    };
  }

  @Get('catalogue')
  @ApiOperation({ summary: 'Catálogo de roles' })
  async catalogue(): Promise<ResponseHttpInterface> {
    const { data, pagination } = await this.rolesService.catalogue();
    return {
      data,
      pagination,
      message: 'Catálogo obtenido correctamente.',
      title: 'Catálogo de roles',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los roles' })
  async findAll(@Query() params: FilterRoleDto): Promise<ResponseHttpInterface> {
    const { data, pagination } = await this.rolesService.findAll(params);
    return {
      data,
      pagination,
      message: 'Listado obtenido correctamente.',
      title: 'Consulta exitosa',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un rol por ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const { data } = await this.rolesService.findOne(id);
    return {
      data,
      message: `Rol con ID ${id} obtenido correctamente.`,
      title: 'Consulta exitosa',
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un rol por ID' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateRoleDto,
  ): Promise<ResponseHttpInterface> {
    const { data } = await this.rolesService.update(id, payload);
    return {
      data,
      message: `Rol con ID ${id} actualizado correctamente.`,
      title: 'Actualización exitosa',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un rol por ID' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpInterface> {
    const { data } = await this.rolesService.remove(id);
    return {
      data,
      message: `Rol con ID ${id} eliminado correctamente.`,
      title: 'Eliminación exitosa',
    };
  }

  @Patch('remove-all')
  @ApiOperation({ summary: 'Eliminar múltiples roles' })
  async removeAll(@Body() payload: RoleEntity[]): Promise<ResponseHttpInterface> {
    const { data } = await this.rolesService.removeAll(payload);
    return {
      data,
      message: 'Roles eliminados correctamente.',
      title: 'Eliminación múltiple exitosa',
    };
  }
}
