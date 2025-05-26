import { Inject, Injectable } from '@nestjs/common';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import {
  AuthRepositoryEnum,
  CommonRepositoryEnum,
  ConfigEnum,
  CoreRepositoryEnum,
} from '@shared/enums';
import {
  ExternalUserEntity,
  InternalDpaUserEntity,
  InternalUserEntity, InternalZonalUserEntity,
  RucEntity,
  ZoneEntity,
} from '@modules/core/entities';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import { DpaEntity } from '@modules/common/dpa/dpa.entity';
import { UserEntity } from '@auth/entities';

@Injectable()
export class MigrationService {
  constructor(
    @Inject(ConfigEnum.PG_DATA_SOURCE_SITURIN_OLD)
    private readonly dataSource: DataSource,
    @Inject(CommonRepositoryEnum.CATALOGUE_REPOSITORY)
    private readonly catalogueRepository: Repository<CatalogueEntity>,
    @Inject(CoreRepositoryEnum.ZONE_REPOSITORY)
    private readonly zoneRepository: Repository<ZoneEntity>,
    @Inject(CommonRepositoryEnum.DPA_REPOSITORY)
    private readonly dpaRepository: Repository<DpaEntity>,
    @Inject(AuthRepositoryEnum.USER_REPOSITORY)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(CoreRepositoryEnum.EXTERNAL_USER_REPOSITORY)
    private readonly externalUserRepository: Repository<ExternalUserEntity>,
    @Inject(CoreRepositoryEnum.INTERNAL_USER_REPOSITORY)
    private readonly internalUserRepository: Repository<InternalUserEntity>,
    @Inject(CoreRepositoryEnum.INTERNAL_DPA_USER_REPOSITORY)
    private readonly internalDpaUserRepository: Repository<InternalDpaUserEntity>,
    @Inject(CoreRepositoryEnum.INTERNAL_ZONAL_USER_REPOSITORY)
    private readonly internalZonalUserRepository: Repository<InternalZonalUserEntity>,
    @Inject(CoreRepositoryEnum.RUC_REPOSITORY)
    private readonly rucRepository: Repository<RucEntity>,
  ) {}

  async getCatalogos(): Promise<any> {
    return await this.dataSource.query(`
      SELECT *
      FROM siturin.catalogos
    `);
  }

  async getZonales(): Promise<any> {
    return await this.dataSource.query(`
      SELECT *
      FROM siturin.zonales
    `);
  }

  async getDpa(): Promise<any> {
    return await this.dataSource.query(`
      SELECT *
      FROM siturin.dpa
    `);
  }

  async getUsers(): Promise<any> {
    return await this.dataSource.query(`
      SELECT *
      FROM authentication.users
    `);
  }

  async getExternalUsers(): Promise<any> {
    return await this.dataSource.query(`
      SELECT *
      FROM siturin.usuario_externos
    `);
  }

  async getInternalUsers(): Promise<any> {
    return await this.dataSource.query(`
      SELECT *
      FROM siturin.usuario_internos
    `);
  }

  async getInternalDPAUsers(): Promise<any> {
    return await this.dataSource.query(`
      SELECT *
      FROM siturin.usuario_interno_dpa
    `);
  }

  async getInternalZonalUsers(): Promise<any> {
    return await this.dataSource.query(`
      SELECT *
      FROM siturin.usuario_interno_zonal
    `);
  }

  async getRucs(): Promise<any> {
    return await this.dataSource.query(`
      SELECT *
      FROM siturin.rucs
    `);
  }

  async migrateCatalogues() {
    const data = await this.getCatalogos();

    for (const item of data) {
      const entity = this.catalogueRepository.create();
      entity.createdAt = item.created_at || new Date();
      entity.updatedAt = item.updated_at || new Date();
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

  async migrateZones() {
    const data = await this.getZonales();

    for (const item of data) {
      const entity = this.zoneRepository.create();
      entity.createdAt = item.created_at || new Date();
      entity.updatedAt = item.updated_at || new Date();
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

  async migrateDPA() {
    const data = await this.getDpa();

    for (const item of data) {
      const entity = this.dpaRepository.create();
      entity.createdAt = item.created_at || new Date();
      entity.updatedAt = item.updated_at || new Date();
      entity.deletedAt = item.deleted_at;
      entity.idTemp = item.id;
      entity.idTempParent = item.padre_id;
      entity.code = item.codigo;
      entity.name = item.nombre;
      entity.latitude = item.latitud;
      entity.longitude = item.longitud;
      entity.zoneType = item.tipo_zona;

      const type = await this.catalogueRepository.findOneBy({
        idTemp: item.tipo_id,
      });

      if (type) entity.typeId = type.id;

      const zone = await this.zoneRepository.findOneBy({
        idTemp: item.zonal_id,
      });

      if (zone) entity.zoneId = zone.id;

      await this.dpaRepository.save(entity);
    }

    const dpa = await this.dpaRepository.find({
      where: { idTempParent: Not(IsNull()) },
    });

    for (const item of dpa) {
      const parent = await this.dpaRepository.findOne({
        where: { idTemp: item.idTempParent },
      });

      if (parent) item.parentId = parent.id;

      await this.dpaRepository.save(item);
    }

    return { data: null };
  }

  async migrateUsers() {
    const data = await this.getUsers();

    for (const item of data) {
      let entity = await this.userRepository.findOneBy({
        identification: item.identification,
      });

      if (!entity) {
        entity = this.userRepository.create();
        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;
        entity.email = item.email;
        entity.identification = item.identification;
        entity.maxAttempts = item.max_attempts;
        entity.name = item.name;
        entity.username = item.email;
        entity.password = item.identification;

        await this.userRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateExternalUsers() {
    const data = await this.getExternalUsers();
    const externalUsers = await this.externalUserRepository.find();
    const users = await this.userRepository.find();

    for (const item of data) {
      const exists = externalUsers.find(
        (register) => register.idTemp == item.id,
      );

      if (!exists) {
        const user = users.find((user) => user.idTemp == item.user_id);
        const entity = this.externalUserRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;
        entity.hasTermCondition = item.terminos_condiciones;

        if (user) entity.userId = user.id;

        await this.externalUserRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateInternalUsers() {
    const data = await this.getInternalUsers();
    const internalUsers = await this.internalUserRepository.find();
    const users = await this.userRepository.find();

    for (const item of data) {
      const exists = internalUsers.find(
        (register) => register.idTemp == item.id,
      );

      if (!exists) {
        const user = users.find((user) => user.idTemp == item.user_id);
        const entity = this.internalUserRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;
        entity.isAvailable = item.es_disponible;

        if (user) entity.userId = user.id;

        await this.internalUserRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateInternalDPAUsers() {
    const data = await this.getInternalDPAUsers();
    const internalDPAUsers = await this.internalDpaUserRepository.find();
    const internalUsers = await this.internalUserRepository.find();
    const dpas = await this.dpaRepository.find();

    for (const item of data) {
      const exists = internalDPAUsers.find(
        (register) => register.idTemp == item.id,
      );

      if (!exists) {
        const internalUser = internalUsers.find(
          (register) => register.idTemp == item.usuario_interno_id,
        );
        const dpa = dpas.find((register) => register.idTemp == item.dpa_id);
        const entity = this.internalDpaUserRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;
        entity.hasProcess = item.tiene_tramite;

        if (internalUser) entity.internalUserId = internalUser.id;
        if (dpa) entity.dpaId = dpa.id;

        await this.internalDpaUserRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateInternalZonalUsers() {
    const data = await this.getInternalZonalUsers();
    const internalZonalUsers = await this.internalZonalUserRepository.find();
    const internalUsers = await this.internalUserRepository.find();
    const zones = await this.zoneRepository.find();

    for (const item of data) {
      const exists = internalZonalUsers.find(
        (register) => register.idTemp == item.id,
      );

      if (!exists) {
        const internalUser = internalUsers.find(
          (register) => register.idTemp == item.usuario_interno_id,
        );
        const zone = zones.find((register) => register.idTemp == item.zonal_id);

        const entity = this.internalZonalUserRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        if (internalUser) entity.internalUserId = internalUser.id;
        if (zone) entity.zoneId = zone.id;

        await this.internalZonalUserRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateRucs() {
    const data = await this.getRucs();
    const catalogues = await this.catalogueRepository.find();

    for (const item of data) {
      const entity = this.rucRepository.create();
      entity.createdAt = item.created_at || new Date();
      entity.updatedAt = item.updated_at || new Date();
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
}
