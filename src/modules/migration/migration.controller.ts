import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseHttpInterface } from '@shared/interfaces';
import { MigrationService } from '@modules/migration/migration.service';
import { PublicRoute } from '@auth/decorators';

@ApiTags('Migrations')
@Controller('migrations')
export class MigrationController {
  constructor(private migrationService: MigrationService) {}

  @PublicRoute()
  @Post('catalogues')
  @HttpCode(HttpStatus.CREATED)
  async migrateCatalogues(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateCatalogues();

    return {
      data: responseService.data,
      message: 'created',
      title: '',
    };
  }

  @PublicRoute()
  @Post('zones')
  @HttpCode(HttpStatus.CREATED)
  async migrateZones(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateZones();

    return {
      data: responseService.data,
      message: 'created',
      title: '',
    };
  }

  @PublicRoute()
  @Post('dpa')
  @HttpCode(HttpStatus.CREATED)
  async migrateDPA(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateDPA();

    return {
      data: responseService.data,
      message: 'created',
      title: '',
    };
  }

  @PublicRoute()
  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  async migrateUsers(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateUsers();

    return {
      data: responseService.data,
      message: 'created',
      title: '',
    };
  }

  @PublicRoute()
  @Post('external-users')
  @HttpCode(HttpStatus.CREATED)
  async migrateExternalUsers(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateExternalUsers();

    return {
      data: responseService.data,
      message: 'created',
      title: '',
    };
  }

  @PublicRoute()
  @Post('internal-users')
  @HttpCode(HttpStatus.CREATED)
  async migrateInternalUsers(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateInternalUsers();

    return {
      data: responseService.data,
      message: 'created',
      title: '',
    };
  }

  @PublicRoute()
  @Post('internal-dpa-users')
  @HttpCode(HttpStatus.CREATED)
  async migrateInternalDPAUsers(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateInternalDPAUsers();

    return {
      data: responseService.data,
      message: 'created',
      title: '',
    };
  }

  @PublicRoute()
  @Post('internal-zonal-users')
  @HttpCode(HttpStatus.CREATED)
  async migrateInternalZonalUsers(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateInternalZonalUsers();

    return {
      data: responseService.data,
      message: 'created',
      title: '',
    };
  }

  @PublicRoute()
  @Post('rucs')
  @HttpCode(HttpStatus.CREATED)
  async migrateRucs(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateRucs();

    return {
      data: responseService.data,
      message: 'created',
      title: '',
    };
  }
}
