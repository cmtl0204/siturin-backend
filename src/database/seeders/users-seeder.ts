import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { CatalogueTypeEnum } from '@utils/enums';
import { RoleEntity } from '@auth/entities';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import { CataloguesService } from '@modules/common/catalogue/catalogue.service';
import { UsersService } from '@auth/services/users.service';
import { RolesService } from '@auth/services/roles.service';

@Injectable()
export class UsersSeeder {
  private identificationTypes: CatalogueEntity[] = [];
  private roles: RoleEntity[] = [];

  constructor(
    private rolesService: RolesService,
    private usersService: UsersService,
    private cataloguesService: CataloguesService,
  ) {}

  async run() {
    await this.loadRoles();
    await this.loadCatalogues();
    await this.createUsers();
  }

  async loadRoles() {
    this.roles = (await this.rolesService.findAll()).data as RoleEntity[];
  }

  async loadCatalogues() {
    const catalogues = (await this.cataloguesService.findAll()).data as CatalogueEntity[];

    this.identificationTypes = catalogues.filter(
      (catalogue) => catalogue.type === CatalogueTypeEnum.IDENTIFICATION_TYPE,
    );
  }

  async createUsers() {
    const users: any[] = [];

    const roles = this.roles;

    users.push({
      birthdate: faker.date.birthdate(),
      cellPhone: '0987654321',
      identification: '1234567890001',
      email: 'admin@admin.com',
      lastname: 'Perez',
      name: 'Admin',
      password: 'admin',
      passwordChanged: false,
      personalEmail: faker.internet.email(),
      roles: roles,
      username: 'admin@admin.com',
    });

    for (const user of users) {
      await this.usersService.create(user);
    }
  }
}
