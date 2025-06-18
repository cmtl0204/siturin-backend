import { Injectable } from '@nestjs/common';
import { CreateCatalogueDto } from '@modules/common/catalogue/dto';
import { CataloguesService } from '@modules/common/catalogue/catalogue.service';
import {
  CatalogueEthnicOriginEnum,
  CatalogueMaritalStatusEnum,
  CatalogueStateEnum,
  CatalogueTypeEnum,
} from '../../utils/enums';

@Injectable()
export class CataloguesSeeder {
  constructor(private catalogueService: CataloguesService) {}

  async run() {
    await this.createBloodTypeCatalogues();
    await this.createEthnicOriginCatalogues();
    await this.createIdentificationTypeCatalogues();
    await this.createSexCatalogues();
    await this.createGenderCatalogues();
    await this.createMaritalStatusCatalogues();
    await this.createYesNoCatalogues();
    await this.createYesNoNACatalogues();
  }

  private async createBloodTypeCatalogues(): Promise<void> {
    const catalogues: CreateCatalogueDto[] = [];
    catalogues.push(
      {
        code: 'a+',
        description: 'tipo de sangre',
        name: 'A+',
        sort: 1,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.BLOOD_TYPE,
      },
      {
        code: 'a-',
        description: 'tipo de sangre',
        name: 'A-',
        sort: 2,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.BLOOD_TYPE,
      },
      {
        code: 'b+',
        description: 'tipo de sangre',
        name: 'B+',
        sort: 3,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.BLOOD_TYPE,
      },
      {
        code: 'b-',
        description: 'tipo de sangre',
        name: 'B-',
        sort: 4,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.BLOOD_TYPE,
      },
      {
        code: 'ab+',
        description: 'tipo de sangre',
        name: 'AB+',
        sort: 5,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.BLOOD_TYPE,
      },
      {
        code: 'ab-',
        description: 'tipo de sangre',
        name: 'AB-',
        sort: 6,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.BLOOD_TYPE,
      },
      {
        code: 'o+',
        description: 'tipo de sangre',
        name: 'O+',
        sort: 7,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.BLOOD_TYPE,
      },
      {
        code: 'o-',
        description: 'tipo de sangre',
        name: 'O-',
        sort: 8,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.BLOOD_TYPE,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }

  private async createEthnicOriginCatalogues() {
    const catalogues: CreateCatalogueDto[] = [];
    catalogues.push(
      {
        code: CatalogueEthnicOriginEnum.INDIGENOUS,
        description: 'etnia',
        name: 'Indígena',
        sort: 1,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.ETHNIC_ORIGIN,
      },
      {
        code: CatalogueEthnicOriginEnum.AFRO_ECUADORIAN,
        description: 'etnia',
        name: 'Afroecuatoriano',
        sort: 1,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.ETHNIC_ORIGIN,
      },
      {
        code: CatalogueEthnicOriginEnum.MONTUBIO,
        description: 'etnia',
        name: 'Montubio',
        sort: 1,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.ETHNIC_ORIGIN,
      },
      {
        code: CatalogueEthnicOriginEnum.HALF_BLOOD,
        description: 'etnia',
        name: 'Mestizo',
        sort: 1,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.ETHNIC_ORIGIN,
      },
      {
        code: CatalogueEthnicOriginEnum.WHITE,
        description: 'etnia',
        name: 'Blanco',
        sort: 1,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.ETHNIC_ORIGIN,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }

  private async createIdentificationTypeCatalogues() {
    const catalogues: CreateCatalogueDto[] = [];
    catalogues.push(
      {
        code: '1',
        description: 'tipo de identificacion',
        name: 'Cédula',
        sort: 1,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.IDENTIFICATION_TYPE,
      },
      {
        code: '2',
        description: 'tipo de identificacion',
        name: 'Pasaporte',
        sort: 1,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.IDENTIFICATION_TYPE,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }

  private async createGenderCatalogues() {
    const catalogues: CreateCatalogueDto[] = [];
    catalogues.push(
      {
        code: '1',
        description: 'genero',
        name: 'Masculino',
        sort: 1,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.GENDER,
      },
      {
        code: '2',
        description: 'tipo de identificacion',
        name: 'Femenino',
        sort: 2,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.GENDER,
      },
      {
        code: '3',
        description: '',
        name: 'LGBTI',
        sort: 3,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.GENDER,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }

  private async createMaritalStatusCatalogues() {
    const catalogues: CreateCatalogueDto[] = [];
    catalogues.push(
      {
        code: CatalogueMaritalStatusEnum.SINGLE,
        description: 'estado civil',
        name: 'Soltero/a',
        sort: 1,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.MARITAL_STATUS,
      },
      {
        code: CatalogueMaritalStatusEnum.MARRIED,
        description: 'estado civil',
        name: 'Casado/a',
        sort: 2,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.MARITAL_STATUS,
      },
      {
        code: CatalogueMaritalStatusEnum.DIVORCED,
        description: 'estado civil',
        name: 'Divorciado/a',
        sort: 3,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.MARITAL_STATUS,
      },
      {
        code: CatalogueMaritalStatusEnum.FREE_UNION,
        description: 'estado civil',
        name: 'Unión libre',
        sort: 4,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.MARITAL_STATUS,
      },
      {
        code: CatalogueMaritalStatusEnum.WIDOWER,
        description: 'estado civil',
        name: 'Viudo/a',
        sort: 5,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.MARITAL_STATUS,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }

  private async createSexCatalogues() {
    const catalogues: CreateCatalogueDto[] = [];
    catalogues.push(
      {
        code: '1',
        description: 'sexo',
        name: 'Hombre',
        sort: 1,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.SEX,
      },
      {
        code: '2',
        description: 'sexo',
        name: 'Mujer',
        sort: 1,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.SEX,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }

  private async createYesNoCatalogues() {
    const catalogues: CreateCatalogueDto[] = [];
    catalogues.push(
      {
        code: '1',
        description: 'Si o No',
        name: 'Sí',
        sort: 1,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.YES_NO,
      },
      {
        code: '2',
        description: 'Si o No',
        name: 'No',
        sort: 1,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.YES_NO,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }

  private async createYesNoNACatalogues() {
    const catalogues: CreateCatalogueDto[] = [];
    catalogues.push(
      {
        code: '1',
        description: 'Si, No y No aplica',
        name: 'Si',
        sort: 1,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.YES_NO_NA,
      },
      {
        code: '2',
        description: 'Si, No y No aplica',
        name: 'No',
        sort: 1,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.YES_NO_NA,
      },
      {
        code: '3',
        description: 'Si, No y No aplica',
        name: 'No apliaca',
        sort: 1,
        state: CatalogueStateEnum.ENABLED,
        type: CatalogueTypeEnum.YES_NO_NA,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }
}
