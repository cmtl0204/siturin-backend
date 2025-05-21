import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseHttpInterface } from '@shared/interfaces';
import { MigrationService } from '@modules/migration/migration.service';
import { PublicRoute } from '@auth/decorators';

@ApiTags('Catalogues')
@Controller('migrations')
export class MigrationController {
  constructor(private migrationService: MigrationService) {}

  @PublicRoute()
  @Post('catalogues')
  @HttpCode(HttpStatus.CREATED)
  async getCatalogues(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateCatalogues();

    return {
      data: responseService.data,
      message: 'created',
      title: '',
    };
  }

  @PublicRoute()
  @Post('rucs')
  @HttpCode(HttpStatus.CREATED)
  async getRucs(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateRucs();

    return {
      data: responseService.data,
      message: 'created',
      title: '',
    };
  }

  @PublicRoute()
  @Post('zones')
  @HttpCode(HttpStatus.CREATED)
  async getZones(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateZones();

    return {
      data: responseService.data,
      message: 'created',
      title: '',
    };
  }
}
