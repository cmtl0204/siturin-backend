import { DataSource } from 'typeorm';
import { CommonRepositoryEnum, ConfigEnum } from '@shared/enums';
import { DpaEntity } from './dpa.entity';

export const dpaProvider = {
  provide: CommonRepositoryEnum.DPA_REPOSITORY,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(DpaEntity),
  inject: [ConfigEnum.PG_DATA_SOURCE],
};
