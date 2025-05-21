import { Inject, Injectable } from '@nestjs/common';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import {
  CommonRepositoryEnum,
  ConfigEnum,
  CoreRepositoryEnum,
} from '@shared/enums';
import { RucEntity, ZoneEntity } from '@modules/core/entities';
import { CataloguesService } from '@modules/common/catalogue/catalogue.service';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';

@Injectable()
export class MigrationService {
  constructor(
    @Inject(ConfigEnum.PG_DATA_SOURCE_SITURIN_OLD)
    private readonly dataSource: DataSource,
    @Inject(CommonRepositoryEnum.CATALOGUE_REPOSITORY)
    private readonly catalogueRepository: Repository<CatalogueEntity>,
    @Inject(CoreRepositoryEnum.RUC_REPOSITORY)
    private readonly rucRepository: Repository<RucEntity>,
    @Inject(CoreRepositoryEnum.ZONE_REPOSITORY)
    private readonly zoneRepository: Repository<ZoneEntity>,
  ) {}

  async getCatalogos(): Promise<any> {
    const data = await this.dataSource.query(`
      SELECT *
      FROM siturin.catalogos
    `);
    return data;
  }

  async getRucs(): Promise<any> {
    const data = await this.dataSource.query(`
      SELECT *
      FROM siturin.rucs
    `);
    return data;
  }

  async getZonales(): Promise<any> {
    const data = await this.dataSource.query(`
      SELECT *
      FROM siturin.zonales
    `);
    return data;
  }

  async migrateCatalogues() {
    const data = await this.getCatalogos();

    for (const item of data) {
      const entity = this.catalogueRepository.create();
      entity.createdAt = item.created_at;
      entity.updatedAt = item.updated_at;
      entity.deletedAt = item.deleted_at;
      entity.idTemp = item.id;
      entity.idTempParent = item.padre_id;
      entity.code = item.codigo;
      entity.description = item.descripcion;
      entity.name = item.nombre;
      entity.type = item.tipo;
      entity.acronym = item.acronimo;

      await this.catalogueRepository.save(entity);
    }

    const catalogues = await this.catalogueRepository.find({
      where: { idTempParent: Not(IsNull()) },
    });

    for (const item of catalogues) {
      const parent = await this.catalogueRepository.findOne({
        where: { idTemp: item.idTempParent },
      });

      if (parent) item.parentId = parent.id;

      await this.catalogueRepository.save(item);
    }

    return { data: null };
  }

  async migrateRucs() {
    const data = await this.getRucs();
    const catalogues = await this.catalogueRepository.find();

    for (const item of data) {
      const entity = this.rucRepository.create();
      entity.createdAt = item.created_at;
      entity.updatedAt = item.updated_at;
      entity.deletedAt = item.deleted_at;
      entity.idTemp = item.id;
      entity.mainEconomicActivity = item.actividad_economica_principal;
      entity.legalRepresentativeIdentification =
        item.representante_legal_identificacion;
      entity.legalRepresentativeNames = item.representante_legal_nombres;
      entity.tradeName = item.nombre_comercial;
      entity.number = item.numero;
      entity.companyRegistrationNumber = item.numero_expediente_supercias;
      entity.legalName = item.razon_social;
      entity.lastUpdatedAt = item.fecha_actualizacion;
      entity.activitiesStartedAt = item.fecha_inicio_actividades;

      const state = catalogues.find(
        (c) => c.idTemp == item.estado_contribuyente_id,
      );

      if (state) entity.stateId = state.id;

      const type = catalogues.find(
        (c) => c.idTemp == item.tipo_contribuyente_id,
      );

      if (type) entity.type = type;

      const legalEntity = catalogues.find(
        (c) => c.idTemp == item.personeria_juridica_id,
      );

      if (legalEntity) entity.legalEntity = legalEntity;

      await this.rucRepository.save(entity);
    }

    return { data: null };
  }

  async migrateZones() {
    const data = await this.getZonales();

    for (const item of data) {
      console.log(item.correos[0]);
      const entity = this.zoneRepository.create();
      entity.createdAt = item.created_at;
      entity.updatedAt = item.updated_at;
      entity.deletedAt = item.deleted_at;
      entity.idTemp = item.id;
      entity.acronym = item.siglas;
      entity.address = item.direccion;
      entity.director = item.director;
      entity.name = item.nombre;
      entity.code = item.numero;
      entity.email = item.correos[0];
      entity.latitude = item.latitud;
      entity.longitude = item.longitud;
      entity.phone = item.telefono;

      await this.zoneRepository.save(entity);
    }

    return { data: null };
  }
}
