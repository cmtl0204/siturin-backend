import { Controller, Get } from '@nestjs/common';
import { ResponseHttpModel } from '@shared/interfaces';
import { DatabaseSeeder } from '@database/seeders';
import { PublicRoute } from '@auth/decorators';

@Controller()
export class AppController {
  constructor(private readonly databaseSeeder: DatabaseSeeder) {}

  @PublicRoute()
  @Get('init')
  async init(): Promise<ResponseHttpModel> {
    await this.databaseSeeder.run();

    return {
      data: true,
      message: '',
      title: '',
    };
  }
}
