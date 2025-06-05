import { Inject, Injectable } from '@nestjs/common';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import {
  AuthRepositoryEnum,
  CommonRepositoryEnum,
  ConfigEnum,
  CoreRepositoryEnum,
} from '@shared/enums';
import {
  ActivityEntity,
  BreachCauseEntity,
  CategoryConfigurationEntity,
  CategoryEntity,
  ClassificationEntity,
  EstablishmentAddressEntity,
  EstablishmentContactPersonEntity,
  EstablishmentEntity,
  ExternalUserEntity,
  InactivationCauseEntity,
  InternalDpaUserEntity,
  InternalUserEntity,
  InternalZonalUserEntity,
  PaymentEntity,
  ProcessEntity,
  RoomTypeEntity,
  RucEntity,
  ZoneEntity,
} from '@modules/core/entities';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import { DpaEntity } from '@modules/common/dpa/dpa.entity';
import { UserEntity } from '@auth/entities';
import { ObservationEntity } from '@modules/core/entities/observation.entity';

@Injectable()
export class MigrationService {
  constructor(
    @Inject(ConfigEnum.PG_DATA_SOURCE_SITURIN_OLD)
    private readonly dataSource: DataSource,
    @Inject(CoreRepositoryEnum.OBSERVATION_REPOSITORY)
    private readonly observationRepository: Repository<ObservationEntity>,
    @Inject(CoreRepositoryEnum.ESTABLISHMENT_ADDRESS_REPOSITORY)
    private readonly establishmentAddressRepository: Repository<EstablishmentAddressEntity>,
    @Inject(CoreRepositoryEnum.ESTABLISHMENT_CONTACT_PERSON_REPOSITORY)
    private readonly establishmentContactPersonRepository: Repository<EstablishmentContactPersonEntity>,
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
    @Inject(CoreRepositoryEnum.ACTIVITY_REPOSITORY)
    private readonly activityRepository: Repository<ActivityEntity>,
    @Inject(CoreRepositoryEnum.CLASSIFICATION_REPOSITORY)
    private readonly classificationRepository: Repository<ClassificationEntity>,
    @Inject(CoreRepositoryEnum.CATEGORY_REPOSITORY)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @Inject(CoreRepositoryEnum.RUC_REPOSITORY)
    private readonly rucRepository: Repository<RucEntity>,
    @Inject(CoreRepositoryEnum.ESTABLISHMENT_REPOSITORY)
    private readonly establishmentRepository: Repository<EstablishmentEntity>,
    @Inject(CoreRepositoryEnum.CATEGORY_CONFIGURATION_REPOSITORY)
    private readonly categoryConfigurationRepository: Repository<CategoryConfigurationEntity>,
    @Inject(CoreRepositoryEnum.PAYMENT_REPOSITORY)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @Inject(CoreRepositoryEnum.ROOM_TYPE_REPOSITORY)
    private readonly roomTypeRepository: Repository<RoomTypeEntity>,
    @Inject(CoreRepositoryEnum.PROCESS_REPOSITORY)
    private readonly processRepository: Repository<ProcessEntity>,
    @Inject(CoreRepositoryEnum.INACTIVATION_CAUSE_REPOSITORY)
    private readonly inactivationCauseRepository: Repository<InactivationCauseEntity>,
    @Inject(CoreRepositoryEnum.BREACH_REPOSITORY)
    private readonly breachCauseRepository: Repository<BreachCauseEntity>,
  ) {}

  async getData(table: string): Promise<any> {
    return await this.dataSource.query(`
      SELECT *
      FROM ${table}
    `);
  }

  async getProcesses(): Promise<any> {
    return await this.dataSource.query(`
      SELECT *
      FROM siturin.tramites t
             inner join siturin.catastros c on c.tramite_id = t.id
      where tipo_id <> 46
        and c.user_id is null;
    `);
  }

  async getProcessAddresses(): Promise<any> {
    return await this.dataSource.query(`
      SELECT *
      FROM siturin.tramites t
             inner join siturin.catastros c on c.tramite_id = t.id
      where tipo_id <> 46
        and c.user_id is null
        and t.ubicacion is not null
      ;
    `);
  }

  async getProcessContactPerson(): Promise<any> {
    return await this.dataSource.query(`
      SELECT *
      FROM siturin.tramites t
             inner join siturin.catastros c on c.tramite_id = t.id
      where tipo_id <> 46
        and c.user_id is null
        and t.persona_contacto is not null limit 100
      ;
    `);
  }

  async migrateCatalogues() {
    const data = await this.getData('siturin.catalogos');

    for (const item of data) {
      const entity = this.catalogueRepository.create();
      entity.createdAt = item.created_at || new Date();
      entity.updatedAt = item.updated_at || new Date();
      entity.deletedAt = item.deleted_at;
      entity.enabled = item.es_visible;

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
    const data = await this.getData('siturin.zonales');

    for (const item of data) {
      const entity = this.zoneRepository.create();
      entity.createdAt = item.created_at || new Date();
      entity.updatedAt = item.updated_at || new Date();
      entity.deletedAt = item.deleted_at;
      entity.enabled = item.es_visible;
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
    const data = await this.getData('siturin.dpa');

    for (const item of data) {
      const entity = this.dpaRepository.create();
      entity.createdAt = item.created_at || new Date();
      entity.updatedAt = item.updated_at || new Date();
      entity.deletedAt = item.deleted_at;
      entity.enabled = item.es_visible;
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
    const data = await this.getData('authentication.users');

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
    const data = await this.getData('siturin.usuario_externos');
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
        entity.enabled = item.es_visible;
        entity.idTemp = item.id;

        entity.hasTermCondition = item.terminos_condiciones;

        if (user) entity.userId = user.id;

        await this.externalUserRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateInternalUsers() {
    const data = await this.getData('siturin.usuario_internos');
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
        entity.enabled = item.es_visible;
        entity.idTemp = item.id;

        entity.isAvailable = item.es_disponible;

        if (user) entity.userId = user.id;

        await this.internalUserRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateInternalDPAUsers() {
    const data = await this.getData('siturin.usuario_interno_dpa');
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
        entity.enabled = item.es_visible;
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
    const data = await this.getData('siturin.usuario_interno_zonal');
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
        entity.enabled = item.es_visible;
        entity.idTemp = item.id;

        if (internalUser) entity.internalUserId = internalUser.id;
        if (zone) entity.zoneId = zone.id;

        await this.internalZonalUserRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateActivities() {
    const data = await this.getData('siturin.actividades');

    const activities = await this.activityRepository.find();
    const catalogues = await this.catalogueRepository.find();

    for (const item of data) {
      const exists = activities.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.activityRepository.create();
        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.enabled = item.es_visible;
        entity.idTemp = item.id;

        entity.code = item.codigo;
        entity.name = item.nombre;
        entity.sort = item.orden;

        const geographicArea = catalogues.find(
          (x) => x.idTemp == item.zona_geografica_id,
        );

        if (geographicArea) entity.geographicAreaId = geographicArea.id;

        await this.activityRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateClassifications() {
    const data = await this.getData('siturin.clasificaciones');

    const classifications = await this.classificationRepository.find();
    const activities = await this.activityRepository.find();

    for (const item of data) {
      const exists = classifications.find(
        (register) => register.idTemp == item.id,
      );

      if (!exists) {
        const entity = this.classificationRepository.create();
        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.enabled = item.es_visible;
        entity.idTemp = item.id;

        entity.code = item.codigo;
        entity.isComplementaryService = item.es_servicio_complementario;
        entity.maxRooms = item.max_habitaciones;
        entity.minRooms = item.min_habitaciones;
        entity.maxPlaces = item.max_plazas;
        entity.minPlaces = item.min_plazas;
        entity.name = item.nombre;
        entity.sort = item.orden;
        entity.hasRegulation = item.tiene_normativa || false;
        entity.hasCategorization = item.tiene_categorizacion || false;

        const activity = activities.find((x) => x.idTemp == item.actividad_id);

        if (activity) entity.activityId = activity.id;

        await this.classificationRepository.save(entity);

        if (Array.isArray(item.capacidades_comentarios)) {
          for (const cc of item.capacidades_comentarios) {
            const observation = this.observationRepository.create();
            observation.modelId = entity.id;
            observation.name = cc;
            await this.observationRepository.save(observation);
          }
        }
      }
    }

    return { data: null };
  }

  async migrateCategories() {
    const data = await this.getData('siturin.categorias');

    const categories = await this.categoryRepository.find();
    const classifications = await this.classificationRepository.find();

    for (const item of data) {
      const exists = categories.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.categoryRepository.create();
        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.enabled = item.es_visible;
        entity.idTemp = item.id;

        entity.name = item.nombre;
        entity.sort = item.orden;
        entity.hasRegulation = item.tiene_normativa || false;

        const classification = classifications.find(
          (x) => x.idTemp == item.clasificacion_id,
        );

        if (classification) entity.classificationId = classification.id;

        await this.categoryRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateRucs() {
    const data = await this.getData('siturin.rucs');
    const rucs = await this.rucRepository.find();
    const catalogues = await this.catalogueRepository.find();

    for (const item of data) {
      const exists = rucs.find((register) => register.idTemp == item.id);

      if (!exists) {
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
          (x) => x.idTemp == item.estado_contribuyente_id,
        );

        if (state) entity.stateId = state.id;

        const type = catalogues.find(
          (x) => x.idTemp == item.tipo_contribuyente_id,
        );

        if (type) entity.typeId = type.id;

        const legalEntity = catalogues.find(
          (x) => x.idTemp == item.personeria_juridica_id,
        );

        if (legalEntity) entity.legalEntityId = legalEntity.id;

        await this.rucRepository.save(entity);
      }
    }
    return { data: null };
  }

  async migrateEstablishments() {
    const data = await this.getData('siturin.establecimientos');

    const establishments = await this.establishmentRepository.find();
    const rucs = await this.rucRepository.find();
    const catalogues = await this.catalogueRepository.find();

    for (const item of data) {
      const exists = establishments.find(
        (register) => register.idTemp == item.id,
      );

      if (!exists) {
        const entity = this.establishmentRepository.create();
        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.enabled = item.es_visible;
        entity.idTemp = item.id;

        entity.tradeName = item.nombre_comercial;
        entity.number = item.numero;
        entity.webPage = item.pagina_web;

        const ruc = rucs.find((x) => x.idTemp == item.ruc_id);

        if (ruc) entity.rucId = ruc.id;

        const state = catalogues.find((x) => x.idTemp == item.estado_id);
        if (state) entity.stateId = state.id;

        await this.establishmentRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateCategoryConfigurations() {
    const data = await this.getData('siturin.configuracion_categorias');
    const categoryConfigurations =
      await this.categoryConfigurationRepository.find();
    const classifications = await this.classificationRepository.find();
    const categories = await this.categoryRepository.find();

    for (const item of data) {
      const exists = categoryConfigurations.find(
        (register) => register.idTemp == item.id,
      );

      if (!exists) {
        const entity = this.categoryConfigurationRepository.create();
        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        entity.min = item.min;
        entity.max = item.orden;
        entity.sort = item.orden;

        const classification = classifications.find(
          (x) => x.idTemp == item.clasificacion_id,
        );
        if (classification) entity.classificationId = classification.id;

        const category = categories.find((x) => x.idTemp == item.categoria_id);
        if (category) entity.categoryId = category.id;

        await this.categoryConfigurationRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migratePayments() {
    const data = await this.getData('siturin.pagos');
    const table = await this.paymentRepository.find();
    const rucs = await this.rucRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.paymentRepository.create();
        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        entity.hasDebt = item.tiene_deuda;
        entity.registeredAt = item.updated_at || null;

        let ruc = rucs.find((x) => x.number == item.ruc);

        if (!ruc) {
          ruc = this.rucRepository.create();
          ruc.idTemp = item.id;
          ruc.number = item.ruc;
          ruc = await this.rucRepository.save(ruc);
        }

        entity.rucId = ruc.id;

        await this.paymentRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateRoomTypes() {
    const data = await this.getData('siturin.tipo_habitaciones');
    const table = await this.roomTypeRepository.find();
    const catalogues = await this.catalogueRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.roomTypeRepository.create();
        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        entity.code = item.codigo;
        entity.isBed = item.es_cama;
        entity.isRoom = item.es_habitacion;
        entity.isPlace = item.es_plaza;
        entity.name = item.nombre;

        const geographicArea = catalogues.find(
          (x) => x.idTemp == item.zona_geografica_id,
        );

        if (geographicArea) {
          entity.geographicAreaId = geographicArea.id;
        }

        await this.roomTypeRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateProcesses() {
    const data = await this.getProcesses();

    const table = await this.processRepository.find();
    const catalogues = await this.catalogueRepository.find();
    const activities = await this.activityRepository.find();
    const classifications = await this.classificationRepository.find();
    const categories = await this.categoryRepository.find();
    const establishments = await this.establishmentRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.processRepository.create();
        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        const activity = activities.find((x) => x.idTemp == item.actividad_id);
        const classification = classifications.find(
          (x) => x.idTemp == item.clasificacion_id,
        );
        const category = categories.find((x) => x.idTemp == item.categoria_id);
        const state = catalogues.find((x) => x.idTemp == item.estado_id);
        const type = catalogues.find((x) => x.idTemp == item.tipo_id);
        const causeInactivationType = catalogues.find(
          (x) => x.idTemp == item.tipo_causa_inactivacion_id,
        );
        const establishment = establishments.find(
          (x) => x.idTemp == item.establecimiento_id,
        );
        const legalEntity = catalogues.find(
          (x) => x.idTemp == item.personeria_juridica_id,
        );

        if (activity) entity.activityId = activity.id;
        if (classification) entity.classificationId = classification.id;
        if (category) entity.categoryId = category.id;
        if (state) entity.stateId = state.id;
        if (type) entity.typeId = type.id;
        if (causeInactivationType)
          entity.causeInactivationTypeId = causeInactivationType.id;
        if (establishment) entity.establishmentId = establishment.id;
        if (legalEntity) entity.legalEntityId = legalEntity.id;

        entity.registeredAt = item.fecha;
        entity.hasTouristActivityDocument =
          item.tiene_documento_actividad_turistica || false;
        entity.hasPersonDesignation = item.tiene_nombramiento_vigente || false;
        entity.totalMen = item.total_hombres || 0;
        entity.totalWomen = item.total_mujeres || 0;
        entity.totalMenDisability = item.total_hombres_discapacidad || 0;
        entity.totalWomenDisability = item.total_mujeres_discapacidad || 0;
        entity.hasLandUse = item.uso_suelos || false;
        entity.attendedAt = item.fecha_atendido;
        entity.isProtectedArea = item.es_area_protegida;
        entity.hasProtectedAreaContract = item.contrato_area_protegida;
        entity.inspectionExpirationAt = item.fecha_limite_inspeccion;

        await this.processRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateProcessAddresses() {
    const data = await this.getProcessAddresses();

    const dpa = await this.dpaRepository.find();
    const establishments = await this.establishmentRepository.find();
    const processes = await this.processRepository.find();

    for (const item of data) {
      const entity = this.establishmentAddressRepository.create();

      const province = dpa.find((x) => x.idTemp == item.provincia_id);
      const canton = dpa.find((x) => x.idTemp == item.canton_id);
      const parish = dpa.find((x) => x.idTemp == item.parroquia_id);
      const establishment = establishments.find(
        (x) => x.idTemp == item.establecimiento_id,
      );
      const process = processes.find((x) => x.idTemp == item.id);

      entity.createdAt = item.created_at || new Date();
      entity.updatedAt = item.updated_at || new Date();

      entity.isCurrent = false;

      if (!item.deleted_at) entity.isCurrent = true;

      entity.establishmentId = establishment?.id!;
      entity.processId = process?.id!;
      entity.provinceId = province?.id!;
      entity.cantonId = canton?.id!;
      entity.parishId = parish?.id!;

      if (item.ubicacion) {
        if (item.ubicacion.callePrincipal) {
          entity.mainStreet = item.ubicacion.callePrincipal;
          entity.secondaryStreet = item.ubicacion.calleInterseccion;
          entity.numberStreet = item.ubicacion.calleNumeracion;
        } else {
          entity.mainStreet = item.ubicacion.direccion;
        }

        entity.referenceStreet = item.ubicacion.calleReferencia;
        entity.latitude = isNaN(item.ubicacion.latitud)
          ? item.ubicacion.latitud
          : 0;
        entity.longitude = isNaN(item.ubicacion.longitud)
          ? item.ubicacion.longitud
          : 0;

        await this.establishmentAddressRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateProcessContactPerson() {
    const data = await this.getProcessContactPerson();

    const establishments = await this.establishmentRepository.find();
    const processes = await this.processRepository.find();

    for (const item of data) {
      const entity = this.establishmentContactPersonRepository.create();

      const establishment = establishments.find(
        (x) => x.idTemp == item.establecimiento_id,
      );
      const process = processes.find((x) => x.idTemp == item.id);

      entity.createdAt = item.created_at || new Date();
      entity.updatedAt = item.updated_at || new Date();

      entity.isCurrent = false;

      if (!item.deleted_at) entity.isCurrent = true;

      entity.establishmentId = establishment?.id!;
      entity.processId = process?.id!;

      if (item.persona_contacto) {
        if (item.persona_contacto.identificacion) {
          entity.identification = item.persona_contacto.identificacion;
        }

        if (item.persona_contacto.nombres) {
          entity.name = item.persona_contacto.nombres;
        }

        if (item.persona_contacto.telefonoPrincipal) {
          entity.phone = item.persona_contacto.telefonoPrincipal;
        }

        if (item.persona_contacto.telefonoSecundario) {
          entity.secondaryPhone = item.persona_contacto.telefonoSecundario;
        }

        if (item.persona_contacto.correo) {
          entity.email = item.persona_contacto.correo;
        }

        const x = await this.establishmentContactPersonRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateProcessTransport() {
    const data = await this.getProcessContactPerson();

    const establishments = await this.establishmentRepository.find();
    const processes = await this.processRepository.find();

    for (const item of data) {
      const entity = this.establishmentContactPersonRepository.create();

      const establishment = establishments.find(
        (x) => x.idTemp == item.establecimiento_id,
      );
      const process = processes.find((x) => x.idTemp == item.id);

      entity.createdAt = item.created_at || new Date();
      entity.updatedAt = item.updated_at || new Date();

      entity.isCurrent = false;

      if (!item.deleted_at) entity.isCurrent = true;

      entity.establishmentId = establishment?.id!;
      entity.processId = process?.id!;

      if (item.persona_contacto) {
        if (item.persona_contacto.identificacion) {
          entity.identification = item.persona_contacto.identificacion;
        }

        if (item.persona_contacto.nombres) {
          entity.name = item.persona_contacto.nombres;
        }

        if (item.persona_contacto.telefonoPrincipal) {
          entity.phone = item.persona_contacto.telefonoPrincipal;
        }

        if (item.persona_contacto.telefonoSecundario) {
          entity.secondaryPhone = item.persona_contacto.telefonoSecundario;
        }

        if (item.persona_contacto.correo) {
          entity.email = item.persona_contacto.correo;
        }

        const x = await this.establishmentContactPersonRepository.save(entity);
      }
    }

    return { data: null };
  }
}
