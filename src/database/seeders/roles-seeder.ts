import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from '@auth/dto';
import { RoleEnum } from '@auth/enums';
import { RolesService } from '@auth/services/roles.service';

@Injectable()
export class RolesSeeder {
  constructor(private rolesService: RolesService) {}

  async run() {
    await this.createRoles();
  }

  private async createRoles() {
    const roles: CreateRoleDto[] = [];
    roles.push({
      code: RoleEnum.ADMIN,
      name: 'Administrador',
    });

    for (const role of roles) {
      await this.rolesService.create(role);
    }
  }
}
