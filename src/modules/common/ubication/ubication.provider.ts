import { DataSource } from 'typeorm';
import { CommonRepositoryEnum, ConfigEnum } from '@shared/enums';
import { ProvinceEntity } from './province.entity';

export const ubicationProvider = {
  provide: CommonRepositoryEnum.DPA_REPOSITORY,
  useFactory: (dataSource: DataSource) =>
    dataSource.getRepository(ProvinceEntity),
  inject: [ConfigEnum.PG_DATA_SOURCE],
};
