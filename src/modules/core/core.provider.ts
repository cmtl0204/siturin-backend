import { DataSource } from 'typeorm';
import { ConfigEnum, CoreRepositoryEnum } from '@shared/enums';
import {
  ActivityEntity,
  AdventureTourismModalityEntity,
  AssignmentEntity,
  CadastreEntity,
  CadastreStateEntity,
  CategoryConfigurationEntity,
  CategoryEntity,
  ClassificationEntity,
  ComplementaryServiceEntity,
  ComplementaryServiceRegulationEntity,
  CtcActivityEntity,
  EstablishmentAddressEntity,
  EstablishmentEntity,
  ExternalUserEntity,
  InspectionEntity,
  InternalDpaUserEntity,
  InternalUserEntity,
  InternalZonalUserEntity,
  JuridicalPersonEntity,
  LandTransportEntity,
  ModelCatalogueEntity,
  ObservationEntity,
  PaymentEntity,
  ProcessAccommodationEntity,
  ProcessAgencyEntity,
  ProcessCtcEntity,
  ProcessEntity,
  ProcessEventEntity,
  ProcessFoodDrinkEntity,
  ProcessParkEntity,
  ProcessTransportEntity,
  RegulationEntity,
  RegulatoryProcessEntity,
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

export const coreProviders = [
  {
    provide: CoreRepositoryEnum.ACTIVITY_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ActivityEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.ADVENTURE_TOURISM_MODALITY_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(AdventureTourismModalityEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.ASSIGNMENT_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(AssignmentEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.CADASTRE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CadastreEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.CADASTRE_STATE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CadastreStateEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.CATEGORY_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CategoryEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.CATEGORY_CONFIGURATION_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CategoryConfigurationEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.CLASSIFICATION_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ClassificationEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.COMPLEMENTARY_SERVICE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ComplementaryServiceEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.COMPLEMENTARY_SERVICE_REGULATION_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ComplementaryServiceRegulationEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.CTC_ACTIVITY_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CtcActivityEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.ESTABLISHMENT_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(EstablishmentEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.ESTABLISHMENT_ADDRESS_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(EstablishmentAddressEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.ESTABLISHMENT_CONTACT_PERSON_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(EstablishmentAddressEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.EXTERNAL_USER_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ExternalUserEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.INSPECTION_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(InspectionEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.INTERNAL_DPA_USER_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(InternalDpaUserEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.INTERNAL_USER_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(InternalUserEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.INTERNAL_ZONAL_USER_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(InternalZonalUserEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.JURIDICAL_PERSON_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(JuridicalPersonEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.LAND_TRANSPORT_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(LandTransportEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.MODEL_CATALOGUE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ModelCatalogueEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.PAYMENT_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PaymentEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.PROCESS_ACCOMMODATION_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProcessAccommodationEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.PROCESS_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProcessEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.PROCESS_AGENCY_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProcessAgencyEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.PROCESS_CTC_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProcessCtcEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.PROCESS_EVENT_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProcessEventEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.PROCESS_FOOD_DRINK_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProcessFoodDrinkEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.PROCESS_PARK_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProcessParkEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.PROCESS_TRANSPORT_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProcessTransportEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.OBSERVATION_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ObservationEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.REGULATION_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RegulationEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.REGULATORY_PROCESS_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RegulatoryProcessEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.ROOM_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RoomEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.ROOM_CAPACITY_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RoomCapacityEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.ROOM_RATE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RoomRateEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.ROOM_TYPE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RoomTypeEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.RUC_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(RucEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.SALES_REPRESENTATIVE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SalesRepresentativeEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.TOURIST_GUIDE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(TouristGuideEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.TOURIST_LICENSE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(TouristLicenseEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.TOURIST_TRANSPORT_COMPANY_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(TouristTransportCompanyEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CoreRepositoryEnum.ZONE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ZoneEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
];
