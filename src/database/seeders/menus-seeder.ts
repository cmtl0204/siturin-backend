import { Injectable } from '@nestjs/common';
import { MenusService, RolesService } from '@auth/services';
import { CreateMenuDto } from '@auth/dto';
import { MenuTypeEnum, RoleEnum } from '@auth/enums';
import { MenuEntity } from '@auth/entities';
import { PrimeIcons } from '../../shared/enums';
import { SeederMenuDto } from '@auth/dto/menus/seeder-menu.dto';

@Injectable()
export class MenusSeeder {
  constructor(
    private menusService: MenusService,
    private rolesService: RolesService,
  ) {}

  async run() {
    await this.createMenus();
    await this.createMenuRole();
  }

  private async createMenus() {
    let menus: any[] = [];

    /** Admin Role **/

    menus = [];
    menus.push(
      {
        code: 'users',
        icon: 'pi pi-users',
        isVisible: true,
        label: 'Usuarios',
        sort: 1,
        routerLink: '/admin/users',
        type: MenuTypeEnum.LEFT_SIDE,
      },
      {
        code: 'menus',
        icon: 'pi pi-users',
        isVisible: true,
        label: 'Menus',
        sort: 2,
        routerLink: '/admin/menus',
        type: MenuTypeEnum.LEFT_SIDE,
      },
    );

    for (const menu of menus) {
      await this.menusService.create(menu);
    }
  }

  private async createMenuRole() {
    const menusAll = (await this.menusService.findAll()).data;

    let role = await this.rolesService.findByCode(RoleEnum.ADMIN);
    role.menus = menusAll.filter((menu) => menu.code === RoleEnum.ADMIN);
    await this.rolesService.createMenus(role);

    role = await this.rolesService.findByCode(RoleEnum.STUDENT);
    role.menus = menusAll.filter((menu) => menu.code === RoleEnum.STUDENT);
    await this.rolesService.createMenus(role);

    role = await this.rolesService.findByCode(RoleEnum.TEACHER);
    role.menus = menusAll.filter((menu) => menu.code === RoleEnum.TEACHER);
    await this.rolesService.createMenus(role);

    role = await this.rolesService.findByCode(RoleEnum.COORDINATOR_CAREER);
    role.menus = menusAll.filter(
      (menu) => menu.code === RoleEnum.COORDINATOR_CAREER,
    );
    await this.rolesService.createMenus(role);

    role = await this.rolesService.findByCode(RoleEnum.REVIEWER);
    role.menus = menusAll.filter((menu) => menu.code === RoleEnum.REVIEWER);
    await this.rolesService.createMenus(role);

    role = await this.rolesService.findByCode(RoleEnum.SECRETARY);
    role.menus = menusAll.filter((menu) => menu.code === RoleEnum.SECRETARY);
    await this.rolesService.createMenus(role);

    role = await this.rolesService.findByCode(RoleEnum.WELFARE);
    role.menus = menusAll.filter((menu) => menu.code === RoleEnum.WELFARE);
    await this.rolesService.createMenus(role);
  }
}
