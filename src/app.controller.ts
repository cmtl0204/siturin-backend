import { Controller, Inject, Post } from '@nestjs/common';
import { ResponseHttpInterface } from '@shared/interfaces';
import { DatabaseSeeder } from '@database/seeders';
import { PublicRoute } from '@auth/decorators';
import { config } from '@config';
import { ConfigType } from '@nestjs/config';

// import { RucsMigrate } from '@database/migrations/rucs.migration';

@Controller()
export class AppController {
  constructor(
    private readonly databaseSeeder: DatabaseSeeder,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}

  @PublicRoute()
  @Post('init')
  async init(): Promise<ResponseHttpInterface> {
    if (this.configService.env === 'local') {
      await this.databaseSeeder.run();

      return {
        data: true,
        message: 'La base de datos fue precargada',
        title: 'Base de datos inicializada',
      };
    }

    return {
      data: true,
      message: 'Se encuentra en ambiente de producción',
      title: 'No es posible procesar su solicitud',
    };
  }
}
