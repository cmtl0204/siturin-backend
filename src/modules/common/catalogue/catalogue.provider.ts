import { DataSource } from 'typeorm';
import { ConfigEnum, CoreRepositoryEnum } from '../../../shared/enums';
import { CatalogueEntity } from './catalogue.entity';

export const catalogueProvider = {
  provide: CoreRepositoryEnum.CATALOGUE_REPOSITORY,
  useFactory: (dataSource: DataSource) =>
    dataSource.getRepository(CatalogueEntity),
  inject: [ConfigEnum.PG_DATA_SOURCE],
};
