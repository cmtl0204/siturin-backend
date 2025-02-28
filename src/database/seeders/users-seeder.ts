import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { CatalogueTypeEnum } from '@shared/enums';
import { RoleEntity } from '@auth/entities';
import { RoleEnum } from '@auth/enums';
import { RolesService } from '@auth/services';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import { CataloguesService } from '@modules/common/catalogue/catalogue.service';
// import * as XLSX from 'xlsx';
import { UsersService } from '@auth/services/users.service';

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
    const catalogues = (await this.cataloguesService.findAll())
      .data as CatalogueEntity[];

    this.identificationTypes = catalogues.filter(
      (catalogue) => catalogue.type === CatalogueTypeEnum.IDENTIFICATION_TYPE,
    );
  }

  async createUsers() {
    const users: any[] = [];

    const adminRole = this.roles.find((role) => role.code === RoleEnum.ADMIN);

    users.push({
      birthdate: faker.date.birthdate(),
      cellPhone: '',
      identification: 'user1',
      email: 'admin@correo.com',
      lastname: 'Perez',
      name: 'Admin',
      password: 'admin',
      passwordChanged: false,
      personalEmail: faker.internet.email(),
      roles: [adminRole],
      username: 'admin',
    });

    for (const user of users) {
      await this.usersService.create(user);
    }
  }
}
