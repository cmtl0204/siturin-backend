import { DataSource } from 'typeorm';
import { CommonRepositoryEnum, ConfigEnum } from '../../../utils/enums';
import { ProvinceEntity } from './province.entity';

export const locationProvider = {
  provide: CommonRepositoryEnum.PROVINCE_REPOSITORY,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(ProvinceEntity),
  inject: [ConfigEnum.PG_DATA_SOURCE],
};
