import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';

import { RoleEntity } from '@auth/entities';
import { PaginationDto } from '../../../utils/dto';
import { ServiceResponseHttpInterface } from '../../../utils/interfaces';
import { AuthRepositoryEnum } from '../../../utils/enums';
import { CreateRoleDto, FilterRoleDto, ReadRoleDto, UpdateRoleDto } from '@auth/dto';

@Injectable()
export class RolesService {
  constructor(
    @Inject(AuthRepositoryEnum.ROLE_REPOSITORY)
    private readonly repository: Repository<RoleEntity>,
  ) {}

  async create(payload: CreateRoleDto): Promise<ServiceResponseHttpInterface> {
    const role = this.repository.create(payload);
    const savedRole = await this.repository.save(role);

    return {
      data: plainToInstance(ReadRoleDto, savedRole),
    };
  }

  async createMenus(role: RoleEntity): Promise<RoleEntity> {
    return await this.repository.save(role);
  }

  async catalogue(): Promise<ServiceResponseHttpInterface> {
    const [roles, count] = await this.repository.findAndCount({ take: 1000 });

    return {
      data: roles,
      pagination: { totalItems: count, limit: 10 },
    };
  }

  async findAll(params?: FilterRoleDto): Promise<ServiceResponseHttpInterface> {
    if (params?.limit && params.page >= 0) {
      return this.paginateAndFilter(params);
    }

    const [roles, count] = await this.repository.findAndCount({
      order: { updatedAt: 'DESC' },
    });

    return {
      data: plainToInstance(ReadRoleDto, roles),
      pagination: { totalItems: count, limit: 10 },
    };
  }

  async findOne(id: string): Promise<ServiceResponseHttpInterface> {
    const role = await this.repository.findOneBy({ id });

    if (!role) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado.`);
    }

    return { data: plainToInstance(ReadRoleDto, role) };
  }

  async findByCode(code: string): Promise<RoleEntity> {
    const role = await this.repository.findOneBy({ code });

    if (!role) {
      throw new NotFoundException(`Rol con código ${code} no encontrado.`);
    }

    return role;
  }

  async update(id: string, payload: UpdateRoleDto): Promise<ServiceResponseHttpInterface> {
    const role = await this.repository.preload({ id, ...payload });

    if (!role) {
      throw new NotFoundException(`No se pudo actualizar: Rol con ID ${id} no encontrado.`);
    }

    const updatedRole = await this.repository.save(role);

    return {
      data: plainToInstance(ReadRoleDto, updatedRole),
    };
  }

  async remove(id: string): Promise<ServiceResponseHttpInterface> {
    const role = await this.repository.findOneBy({ id });

    if (!role) {
      throw new NotFoundException(`No se pudo eliminar: Rol con ID ${id} no encontrado.`);
    }

    const deletedRole = await this.repository.softRemove(role);

    return {
      data: plainToInstance(ReadRoleDto, deletedRole),
    };
  }

  async removeAll(payload: RoleEntity[]): Promise<ServiceResponseHttpInterface> {
    const deletedRoles = await this.repository.softRemove(payload);
    return { data: deletedRoles };
  }

  private async paginateAndFilter(params: FilterRoleDto): Promise<ServiceResponseHttpInterface> {
    const { page, limit, search } = params;
    let where: FindOptionsWhere<RoleEntity>[] = [];

    if (search?.trim()) {
      const term = `%${search.trim()}%`;
      where = [{ code: ILike(term) }, { name: ILike(term) }];
    }

    const [roles, count] = await this.repository.findAndCount({
      where: where.length ? where : undefined,
      take: limit,
      skip: PaginationDto.getOffset(limit, page),
      order: { updatedAt: 'DESC' },
    });

    return {
      data: plainToInstance(ReadRoleDto, roles),
      pagination: { limit, totalItems: count },
    };
  }
}
