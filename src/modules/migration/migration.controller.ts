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
    const responseService =
      await this.migrationService.migrateInternalDPAUsers();

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
    const responseService =
      await this.migrationService.migrateInternalZonalUsers();

    return {
      data: responseService.data,
      message: 'created',
      title: '',
    };
  }

  @PublicRoute()
  @Post('activities')
  @HttpCode(HttpStatus.CREATED)
  async migrateActivities(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateActivities();

    return {
      data: responseService.data,
      message: 'created',
      title: '',
    };
  }

  @PublicRoute()
  @Post('classifications')
  @HttpCode(HttpStatus.CREATED)
  async migrateClassifications(): Promise<ResponseHttpInterface> {
    const responseService =
      await this.migrationService.migrateClassifications();

    return {
      data: responseService.data,
      message: 'created',
      title: '',
    };
  }

  @PublicRoute()
  @Post('categories')
  @HttpCode(HttpStatus.CREATED)
  async migrateCategories(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateCategories();

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

  @PublicRoute()
  @Post('establishments')
  @HttpCode(HttpStatus.CREATED)
  async migrateEstablishments(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateEstablishments();

    return {
      data: responseService.data,
      message: 'created',
      title: '',
    };
  }

  @PublicRoute()
  @Post('category-configurations')
  @HttpCode(HttpStatus.CREATED)
  async migrateCategoryConfigurations(): Promise<ResponseHttpInterface> {
    const responseService =
      await this.migrationService.migrateCategoryConfigurations();

    return {
      data: responseService.data,
      message: 'created',
      title: '',
    };
  }

  @PublicRoute()
  @Post('payments')
  @HttpCode(HttpStatus.CREATED)
  async migratePayments(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migratePayments();

    return {
      data: responseService.data,
      message: 'created',
      title: '',
    };
  }

  @PublicRoute()
  @Post('room-types')
  @HttpCode(HttpStatus.CREATED)
  async migrateRoomTypes(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateRoomTypes();

    return {
      data: responseService.data,
      message: 'created',
      title: '',
    };
  }

  @PublicRoute()
  @Post('processes')
  @HttpCode(HttpStatus.CREATED)
  async migrateProcesses(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateProcesses();

    return {
      data: responseService.data,
      message: 'created',
      title: '',
    };
  }

  @PublicRoute()
  @Post('process-addresses')
  @HttpCode(HttpStatus.CREATED)
  async migrateProcessesAddresses(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateProcessAddresses();

    return {
      data: responseService.data,
      message: 'created',
      title: '',
    };
  }

  @PublicRoute()
  @Post('process-contact-persons')
  @HttpCode(HttpStatus.CREATED)
  async migrateProcessContactPerson(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateProcessContactPersons();

    return {
      data: responseService.data,
      message: 'created',
      title: 'process-contact-persons',
    };
  }

  @PublicRoute()
  @Post('process-food-drinks')
  @HttpCode(HttpStatus.CREATED)
  async migrateProcessFoodDrinks(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateProcessFoodDrinks();

    return {
      data: responseService.data,
      message: 'created',
      title: 'process-contact-persons',
    };
  }

  @PublicRoute()
  @Post('process-accommodation')
  @HttpCode(HttpStatus.CREATED)
  async migrateProcessAccommodation(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateProcessAccommodation();

    return {
      data: responseService.data,
      message: 'created',
      title: 'process-contact-persons',
    };
  }

  @PublicRoute()
  @Post('process-events')
  @HttpCode(HttpStatus.CREATED)
  async migrateProcessEvents(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateProcessEvents();

    return {
      data: responseService.data,
      message: 'created',
      title: 'process-contact-persons',
    };
  }

  @PublicRoute()
  @Post('process-ctc')
  @HttpCode(HttpStatus.CREATED)
  async migrateProcessCtc(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateProcessCtc();

    return {
      data: responseService.data,
      message: 'created',
      title: 'process-contact-persons',
    };
  }

  @PublicRoute()
  @Post('process-agencies')
  @HttpCode(HttpStatus.CREATED)
  async migrateProcessAgencies(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateProcessAgencies();

    return {
      data: responseService.data,
      message: 'created',
      title: 'process-contact-persons',
    };
  }

  @PublicRoute()
  @Post('process-parks')
  @HttpCode(HttpStatus.CREATED)
  async migrateProcessParks(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateProcessParks();

    return {
      data: responseService.data,
      message: 'created',
      title: 'process-contact-persons',
    };
  }

  @PublicRoute()
  @Post('process-transports')
  @HttpCode(HttpStatus.CREATED)
  async migrateProcessTransports(): Promise<ResponseHttpInterface> {
    const responseService = await this.migrationService.migrateProcessTransports();

    return {
      data: responseService.data,
      message: 'created',
      title: 'process-contact-persons',
    };
  }
}
