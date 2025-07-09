import { Inject, Injectable } from '@nestjs/common';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import {
  AuthRepositoryEnum,
  CommonRepositoryEnum,
  ConfigEnum,
  CoreRepositoryEnum,
} from '@utils/enums';
import {
  ActivityEntity,
  AdventureTourismModalityEntity,
  AssignmentEntity,
  BreachCauseEntity,
  CadastreEntity,
  CategoryConfigurationEntity,
  CategoryEntity,
  ClassificationEntity,
  ComplementaryServiceRegulationEntity,
  CtcActivityEntity,
  EstablishmentAddressEntity,
  EstablishmentContactPersonEntity,
  EstablishmentEntity,
  ExternalUserEntity,
  InactivationCauseEntity,
  InspectionEntity,
  InternalDpaUserEntity,
  InternalUserEntity,
  InternalZonalUserEntity,
  LandTransportEntity, ModelCatalogueEntity,
  PaymentEntity,
  ProcessAccommodationEntity,
  ProcessAgencyEntity,
  ProcessCtcEntity,
  ProcessEntity,
  ProcessEventEntity,
  ProcessFoodDrinkEntity,
  ProcessParkEntity,
  ProcessTransportEntity,
  RoomCapacityEntity,
  RoomEntity,
  RoomRateEntity,
  RoomTypeEntity,
  RucEntity,
  SalesRepresentativeEntity,
  TouristGuideEntity,
  TouristLicenseEntity,
  TouristTransportCompanyEntity,
  ZoneEntity,
} from '@modules/core/entities';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import { DpaEntity } from '@modules/common/dpa/dpa.entity';
import { UserEntity } from '@auth/entities';
import { ObservationEntity } from '@modules/core/entities/observation.entity';
import { KitchenTypeEntity } from '@modules/core/entities/kitchen-type.entity';
import { ServiceTypeEntity } from '@modules/core/entities/service-type.entity';

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
    @Inject(CoreRepositoryEnum.PROCESS_FOOD_DRINK_REPOSITORY)
    private readonly processFoodDrinkRepository: Repository<ProcessFoodDrinkEntity>,
    @Inject(CoreRepositoryEnum.KITCHEN_TYPE_REPOSITORY)
    private readonly kitchenTypeRepository: Repository<KitchenTypeEntity>,
    @Inject(CoreRepositoryEnum.SERVICE_TYPE_REPOSITORY)
    private readonly serviceTypeRepository: Repository<ServiceTypeEntity>,
    @Inject(CoreRepositoryEnum.PROCESS_ACCOMMODATION_REPOSITORY)
    private readonly processAccommodationRepository: Repository<ProcessAccommodationEntity>,
    @Inject(CoreRepositoryEnum.PROCESS_CTC_REPOSITORY)
    private readonly processCtcRepository: Repository<ProcessCtcEntity>,
    @Inject(CoreRepositoryEnum.CTC_ACTIVITY_REPOSITORY)
    private readonly ctcActivityRepository: Repository<CtcActivityEntity>,
    @Inject(CoreRepositoryEnum.PROCESS_EVENT_REPOSITORY)
    private readonly processEventRepository: Repository<ProcessEventEntity>,
    @Inject(CoreRepositoryEnum.PROCESS_AGENCY_REPOSITORY)
    private readonly processAgencyRepository: Repository<ProcessAgencyEntity>,
    @Inject(CoreRepositoryEnum.PROCESS_PARK_REPOSITORY)
    private readonly processParkRepository: Repository<ProcessParkEntity>,
    @Inject(CoreRepositoryEnum.PROCESS_TRANSPORT_REPOSITORY)
    private readonly processTransportRepository: Repository<ProcessTransportEntity>,
    @Inject(CoreRepositoryEnum.LAND_TRANSPORT_REPOSITORY)
    private readonly landTransportRepository: Repository<LandTransportEntity>,
    @Inject(CoreRepositoryEnum.ASSIGNMENT_REPOSITORY)
    private readonly assignmentRepository: Repository<AssignmentEntity>,
    @Inject(CoreRepositoryEnum.INSPECTION_REPOSITORY)
    private readonly inspectionRepository: Repository<InspectionEntity>,
    @Inject(CoreRepositoryEnum.CADASTRE_REPOSITORY)
    private readonly cadastreRepository: Repository<CadastreEntity>,
    @Inject(CoreRepositoryEnum.TOURIST_TRANSPORT_COMPANY_REPOSITORY)
    private readonly touristTransportCompanyRepository: Repository<TouristTransportCompanyEntity>,
    @Inject(CoreRepositoryEnum.TOURIST_GUIDE_REPOSITORY)
    private readonly touristGuideRepository: Repository<TouristGuideEntity>,
    @Inject(CoreRepositoryEnum.TOURIST_LICENSE_REPOSITORY)
    private readonly touristLicenseRepository: Repository<TouristLicenseEntity>,
    @Inject(CoreRepositoryEnum.ROOM_REPOSITORY)
    private readonly roomRepository: Repository<RoomEntity>,
    @Inject(CoreRepositoryEnum.ROOM_RATE_REPOSITORY)
    private readonly roomRateRepository: Repository<RoomRateEntity>,
    @Inject(CoreRepositoryEnum.ROOM_CAPACITY_REPOSITORY)
    private readonly roomCapacityRepository: Repository<RoomCapacityEntity>,
    @Inject(CoreRepositoryEnum.ADVENTURE_TOURISM_MODALITY_REPOSITORY)
    private readonly adventureTourismModalityRepository: Repository<AdventureTourismModalityEntity>,
    @Inject(CoreRepositoryEnum.COMPLEMENTARY_SERVICE_REGULATION_REPOSITORY)
    private readonly complementaryServiceRegulationRepository: Repository<ComplementaryServiceRegulationEntity>,
    @Inject(CoreRepositoryEnum.SALES_REPRESENTATIVE_REPOSITORY)
    private readonly salesRepresentativeRepository: Repository<SalesRepresentativeEntity>,
    @Inject(CoreRepositoryEnum.MODEL_CATALOGUE_REPOSITORY)
    private readonly modelCatalogueRepository: Repository<ModelCatalogueEntity>,
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
      const exists = externalUsers.find((register) => register.idTemp == item.id);

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
      const exists = internalUsers.find((register) => register.idTemp == item.id);

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
      const exists = internalDPAUsers.find((register) => register.idTemp == item.id);

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
      const exists = internalZonalUsers.find((register) => register.idTemp == item.id);

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

        const geographicArea = catalogues.find((x) => x.idTemp == item.zona_geografica_id);

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
      const exists = classifications.find((register) => register.idTemp == item.id);

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

        const classification = classifications.find((x) => x.idTemp == item.clasificacion_id);

        if (classification) entity.classificationId = classification.id;

        await this.categoryRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateRucs() {
    const data = await this.getData('siturin.rucs');
    const table = await this.rucRepository.find();
    const catalogues = await this.catalogueRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.rucRepository.create();
        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;
        entity.mainEconomicActivity = item.actividad_economica_principal;
        entity.legalRepresentativeIdentification = item.representante_legal_identificacion;
        entity.legalRepresentativeNames = item.representante_legal_nombres;
        entity.tradeName = item.nombre_comercial;
        entity.number = item.numero;
        entity.companyRegistrationNumber = item.numero_expediente_supercias;
        entity.legalName = item.razon_social;
        entity.lastUpdatedAt = item.fecha_actualizacion;
        entity.activitiesStartedAt = item.fecha_inicio_actividades;

        const state = catalogues.find((x) => x.idTemp == item.estado_contribuyente_id);

        if (state) entity.stateId = state.id;

        const type = catalogues.find((x) => x.idTemp == item.tipo_contribuyente_id);

        if (type) entity.typeId = type.id;

        const legalEntity = catalogues.find((x) => x.idTemp == item.personeria_juridica_id);

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
      const exists = establishments.find((register) => register.idTemp == item.id);

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
    const categoryConfigurations = await this.categoryConfigurationRepository.find();
    const classifications = await this.classificationRepository.find();
    const categories = await this.categoryRepository.find();

    for (const item of data) {
      const exists = categoryConfigurations.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.categoryConfigurationRepository.create();
        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        entity.min = item.min;
        entity.max = item.orden;
        entity.sort = item.orden;

        const classification = classifications.find((x) => x.idTemp == item.clasificacion_id);
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

        const geographicArea = catalogues.find((x) => x.idTemp == item.zona_geografica_id);

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
        const classification = classifications.find((x) => x.idTemp == item.clasificacion_id);
        const category = categories.find((x) => x.idTemp == item.categoria_id);
        const state = catalogues.find((x) => x.idTemp == item.estado_id);
        const type = catalogues.find((x) => x.idTemp == item.tipo_id);
        const causeInactivationType = catalogues.find(
          (x) => x.idTemp == item.tipo_causa_inactivacion_id,
        );
        const establishment = establishments.find((x) => x.idTemp == item.establecimiento_id);
        const legalEntity = catalogues.find((x) => x.idTemp == item.personeria_juridica_id);

        if (activity) entity.activityId = activity.id;
        if (classification) entity.classificationId = classification.id;
        if (category) entity.categoryId = category.id;
        if (state) entity.stateId = state.id;
        if (type) entity.typeId = type.id;
        if (causeInactivationType) entity.causeInactivationTypeId = causeInactivationType.id;
        if (establishment) entity.establishmentId = establishment.id;
        if (legalEntity) entity.legalEntityId = legalEntity.id;

        entity.registeredAt = item.fecha;
        entity.hasTouristActivityDocument = item.tiene_documento_actividad_turistica || false;
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
      const establishment = establishments.find((x) => x.idTemp == item.establecimiento_id);
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
        entity.latitude = isNaN(item.ubicacion.latitud) ? item.ubicacion.latitud : 0;
        entity.longitude = isNaN(item.ubicacion.longitud) ? item.ubicacion.longitud : 0;

        await this.establishmentAddressRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateProcessContactPersons() {
    const data = await this.getProcessContactPerson();

    const establishments = await this.establishmentRepository.find();
    const processes = await this.processRepository.find();

    for (const item of data) {
      const entity = this.establishmentContactPersonRepository.create();

      const establishment = establishments.find((x) => x.idTemp == item.establecimiento_id);
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

  async migrateProcessFoodDrinks() {
    const data = await this.getData('siturin.tramite_alimentos_bebidas');

    const table = await this.processFoodDrinkRepository.find();
    const processes = await this.processRepository.find();
    const catalogues = await this.catalogueRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.processFoodDrinkRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        entity.establishmentName = item.nombre_establecimiento;
        entity.hasFranchiseGrantCertificate = item.tiene_certificado_concesion_franquicia;
        entity.score = item.puntaje;
        entity.totalTables = item.total_mesas;
        entity.totalCapacities = item.total_capacidades;

        const process = processes.find((x) => x.idTemp == item.tramite_id);

        const establishmentType = catalogues.find((x) => x.idTemp == item.tipo_establecimiento_id);

        if (process) entity.processId = process.id;

        if (establishmentType) entity.establishmentTypeId = establishmentType.id;

        await this.processFoodDrinkRepository.save(entity);

        if (Array.isArray(item.tipos_cocina)) {
          for (const tc of item.tipos_cocina) {
            if (tc?.codigo) {
              const kitchenType = this.kitchenTypeRepository.create();
              kitchenType.idTemp = item.id;
              kitchenType.code = tc.codigo;
              kitchenType.name = tc.nombre;

              if (process) kitchenType.processId = process.id;

              await this.kitchenTypeRepository.save(kitchenType);
            }
          }
        }

        if (Array.isArray(item.tipos_servicio)) {
          for (const ts of item.tipos_servicio) {
            if (ts?.codigo) {
              const serviceType = this.serviceTypeRepository.create();
              serviceType.idTemp = item.id;
              serviceType.code = ts.codigo;
              serviceType.name = ts.nombre;
              if (process) serviceType.processId = process.id;

              await this.serviceTypeRepository.save(serviceType);
            }
          }
        }
      }
    }

    return { data: null };
  }

  async migrateProcessAccommodation() {
    const data = await this.getData('siturin.tramite_alojamientos');

    const table = await this.processAccommodationRepository.find();
    const processes = await this.processRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.processAccommodationRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        entity.inactivationCode = item.codigo_inactivacion;
        entity.inactivationAt = item.fecha_inactivacion;
        entity.rackYear = item.anio_rack;
        entity.declarationAt = item.fecha_declaracion;

        const process = processes.find((x) => x.idTemp == item.tramite_id);

        if (process) entity.processId = process.id;

        await this.processAccommodationRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateProcessEvents() {
    const data = await this.getData('siturin.tramite_eventos');

    const table = await this.processEventRepository.find();
    const processes = await this.processRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.processEventRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        entity.totalCapacities = item.total_capacidades;

        const process = processes.find((x) => x.idTemp == item.tramite_id);

        if (process) entity.processId = process.id;

        await this.processEventRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateProcessCtc() {
    const data = await this.getData('siturin.tramite_ctc');

    const table = await this.processCtcRepository.find();
    const processes = await this.processRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.processCtcRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        entity.totalBeds = item.total_camas;
        entity.totalCapacities = item.total_capacidades;
        entity.totalRooms = item.total_habitaciones;
        entity.totalTables = item.total_mesas;
        entity.totalPlaces = item.total_plazas;
        entity.hasPropertyRegistrationCertificate = item.tiene_certificado_registro_propiedad;
        entity.hasTechnicalReport = item.tiene_informe_tecnico;
        entity.hasStatute = item.tiene_estatuo;

        const process = processes.find((x) => x.idTemp == item.tramite_id);

        if (process) entity.processId = process.id;

        await this.processCtcRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateProcessAgencies() {
    const data = await this.getData('siturin.tramite_operaciones_intermediaciones');

    const table = await this.processAgencyRepository.find();
    const processes = await this.processRepository.find();
    const catalogues = await this.catalogueRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.processAgencyRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        entity.totalAccreditedStaffLanguage = item.personal_acreditado_idioma;

        const process = processes.find((x) => x.idTemp == item.tramite_id);
        const permanentPhysicalSpace = catalogues.find(
          (x) => x.idTemp == item.espacio_fisico_permanente_id,
        );

        if (process) entity.processId = process.id;
        if (permanentPhysicalSpace) entity.permanentPhysicalSpaceId = permanentPhysicalSpace.id;

        await this.processAgencyRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateProcessParks() {
    const data = await this.getData('siturin.tramite_parques');

    const table = await this.processParkRepository.find();
    const processes = await this.processRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.processParkRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        entity.totalCapacities = item.total_capacidades;

        const process = processes.find((x) => x.idTemp == item.tramite_id);

        if (process) entity.processId = process.id;

        await this.processParkRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateProcessTransports() {
    const data = await this.getData('siturin.tramite_transportes');

    const table = await this.processTransportRepository.find();
    const processes = await this.processRepository.find();
    const catalogues = await this.catalogueRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.processTransportRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        entity.certified = item.certificado;
        entity.certifiedCode = item.codigo_certificado;
        entity.certifiedIssueAt = item.fecha_emision_certificado;
        entity.certifiedExpirationAt = item.fecha_caducidad_certificado;
        entity.totalUnits = item.total_unidades;
        entity.totalSeats = item.total_asientos;

        const process = processes.find((x) => x.idTemp == item.tramite_id);
        const localType = catalogues.find((x) => x.idTemp == item.tipo_local_id);
        const airlineType = catalogues.find((x) => x.idTemp == item.tipo_aerolinea_id);

        if (process) entity.processId = process.id;
        if (localType) entity.localTypeId = localType.id;
        if (airlineType) entity.airlineTypeId = airlineType.id;

        await this.processTransportRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateAssignments() {
    const data = await this.getData('siturin.asignaciones');

    const table = await this.assignmentRepository.find();
    const processes = await this.processRepository.find();
    const dpas = await this.dpaRepository.find();
    const internalUsers = await this.internalUserRepository.find();
    const zones = await this.zoneRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.assignmentRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        entity.isCurrent = item.es_actual;
        entity.registeredAt = item.fecha;

        const process = processes.find((x) => x.idTemp == item.tramite_id);
        const dpa = dpas.find((x) => x.idTemp == item.dpa_id);
        const internalUser = internalUsers.find((x) => x.idTemp == item.usuario_interno_id);
        const zone = zones.find((x) => x.idTemp == item.zonal_id);

        if (process) entity.processId = process.id;
        if (dpa) entity.dpaId = dpa.id;
        if (internalUser) entity.internalUserId = internalUser.id;
        if (zone) entity.zoneId = zone.id;

        await this.assignmentRepository.save(entity);

        if (Array.isArray(item.observaciones)) {
          for (const cc of item.observaciones) {
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

  async migrateCtcActivities() {
    const data = await this.getData('siturin.ctc_actividades');

    const table = await this.ctcActivityRepository.find();
    const processes = await this.processRepository.find();
    const catalogues = await this.catalogueRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.ctcActivityRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        const process = processes.find((x) => x.idTemp == item.tramite_id);
        const activity = catalogues.find((x) => x.idTemp == item.actividad_id);

        if (process) entity.processId = process.id;
        if (activity) entity.activityId = activity.id;

        await this.ctcActivityRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateTouristGuides() {
    const data = await this.getData('siturin.guia_turismos');

    const table = await this.touristGuideRepository.find();
    const processes = await this.processRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.touristGuideRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        entity.isGuide = item.es_guia;
        entity.identification = item.cedula;
        entity.name = item.nombres;

        const process = processes.find((x) => x.idTemp == item.tramite_id);

        if (process) entity.processId = process.id;

        await this.touristGuideRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateRooms() {
    const data = await this.getData('siturin.habitaciones');

    const table = await this.roomRepository.find();
    const processes = await this.processRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.roomRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        entity.totalBeds = item.camas;
        entity.totalPlaces = item.plazas;
        entity.totalRooms = item.habitaciones;

        const process = processes.find((x) => x.idTemp == item.tramite_id);

        if (process) entity.processId = process.id;

        await this.roomRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateRoomRates() {
    const data = await this.getData('siturin.habitacion_tarifas');

    const table = await this.roomRateRepository.find();
    const rooms = await this.roomRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.roomRateRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        entity.highRoom = item.habitacion_temporada_alta;
        entity.lowRoom = item.habitacion_temporada_baja;
        entity.highPerson = item.persona_temporada_alta;
        entity.lowPerson = item.persona_temporada_baja;
        entity.year = item.anio;
        entity.declarationAt = item.fecha_declaracion;

        const room = rooms.find((x) => x.idTemp == item.habitacion_id);

        if (room) entity.roomId = room.id;

        await this.roomRateRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateRoomCapacities() {
    const data = await this.getData('siturin.capacidad_habitaciones');

    const table = await this.roomCapacityRepository.find();
    const categories = await this.categoryRepository.find();
    const roomTypes = await this.roomTypeRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.roomCapacityRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        const category = categories.find((x) => x.idTemp == item.categoria_id);
        const roomType = roomTypes.find((x) => x.idTemp == item.tipo_habitacion_id);

        if (category) entity.categoryId = category.id;
        if (roomType) entity.roomTypeId = roomType.id;

        await this.roomCapacityRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateInspections() {
    const data = await this.getData('siturin.inspecciones');

    const table = await this.inspectionRepository.find();
    const processes = await this.processRepository.find();
    const internalUsers = await this.internalUserRepository.find();
    const catalogues = await this.catalogueRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.inspectionRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        entity.isCurrent = item.camas;
        entity.attendedAt = item.plazas;
        entity.inspectionAt = item.habitaciones;
        entity.requestAt = item.habitaciones;

        const process = processes.find((x) => x.idTemp == item.tramite_id);
        const internalUser = internalUsers.find((x) => x.idTemp == item.usuario_interno_id);
        const state = catalogues.find((x) => x.idTemp == item.estado_fecha_id);

        if (process) entity.processId = process.id;
        if (internalUser) entity.internalUserId = internalUser.id;
        if (state) entity.stateId = state.id;

        await this.inspectionRepository.save(entity);

        if (Array.isArray(item.observaciones)) {
          for (const cc of item.observaciones) {
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

  async migrateTouristLicenses() {
    const data = await this.getData('siturin.licencias');

    const table = await this.touristLicenseRepository.find();
    const touristGuides = await this.touristGuideRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.touristLicenseRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        entity.code = item.codigo;
        entity.classification = item.clasificacion;
        entity.expirationAt = item.fecha_caducidad;
        entity.issueAt = item.fecha_emision;

        const touristGuide = touristGuides.find((x) => x.idTemp == item.guia_turismo_id);

        if (touristGuide) entity.touristGuideId = touristGuide.id;

        await this.touristLicenseRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateAdventureTourismModalities() {
    const data = await this.getData('siturin.modalidad_turismo_aventuras');

    const table = await this.adventureTourismModalityRepository.find();
    const processes = await this.processRepository.find();
    const catalogues = await this.catalogueRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.adventureTourismModalityRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        const process = processes.find((x) => x.idTemp == item.tramite_id);
        const type = catalogues.find((x) => x.idTemp == item.tipo_id);

        if (process) entity.processId = process.id;
        if (type) entity.typeId = type.id;

        await this.adventureTourismModalityRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateSalesRepresentatives() {
    const data = await this.getData('siturin.representante_ventas');

    const table = await this.salesRepresentativeRepository.find();
    const processes = await this.processRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.salesRepresentativeRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        entity.legalName = item.razon_social;
        entity.ruc = item.ruc;
        entity.hasProfessionalDegree = item.tiene_titulo_profesional;
        entity.hasContract = item.tiene_contrato;
        entity.hasWorkExperience = item.tiene_experiencia_profesional;

        const process = processes.find((x) => x.idTemp == item.tramite_id);

        if (process) entity.processId = process.id;

        await this.salesRepresentativeRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateLandTransports() {
    const data = await this.getData('siturin.transporte_terrestres');

    const table = await this.landTransportRepository.find();
    const processes = await this.processRepository.find();
    const catalogues = await this.catalogueRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.landTransportRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        entity.plate = item.placa;
        entity.registration = item.matricula;
        entity.registrationAt = item.fecha_matricula;
        entity.registrationExpirationAt = item.fecha_caducidad_matricula;
        entity.capacity = item.capacidad;

        const process = processes.find((x) => x.idTemp == item.tramite_id);
        const type = catalogues.find((x) => x.idTemp == item.tipo_id);

        if (process) entity.processId = process.id;
        if (type) entity.typeId = type.id;

        await this.landTransportRepository.save(entity);
      }
    }

    return { data: null };
  }

  async migrateModelCatalogues() {
    const data = await this.getData('siturin.catalogo_modelo');

    const table = await this.modelCatalogueRepository.find();
    const classifications = await this.classificationRepository.find();
    const catalogues = await this.catalogueRepository.find();

    for (const item of data) {
      const exists = table.find((register) => register.idTemp == item.id);

      if (!exists) {
        const entity = this.modelCatalogueRepository.create();

        entity.createdAt = item.created_at || new Date();
        entity.updatedAt = item.updated_at || new Date();
        entity.deletedAt = item.deleted_at;
        entity.idTemp = item.id;

        const model = classifications.find((x) => x.idTemp == item.modelo_id);
        const catalogue = catalogues.find((x) => x.idTemp == item.catalogo_id);

        if (model) entity.modelId = model.id;
        if (catalogue) entity.catalogueId = catalogue.id;

        await this.modelCatalogueRepository.save(entity);
      }
    }

    return { data: null };
  }
}
