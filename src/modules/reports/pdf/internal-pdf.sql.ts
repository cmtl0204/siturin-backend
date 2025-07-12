import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthRepositoryEnum, CoreRepositoryEnum } from '@utils/enums';
import { CadastreEntity, RucEntity } from '@modules/core/entities';
import { UserEntity } from '@auth/entities';

@Injectable()
export class InternalPdfSql {
  constructor(
    @Inject(CoreRepositoryEnum.CADASTRE_REPOSITORY)
    private readonly cadastreRepository: Repository<CadastreEntity>,
    @Inject(AuthRepositoryEnum.USER_REPOSITORY)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(CoreRepositoryEnum.RUC_REPOSITORY)
    private readonly rucRepository: Repository<RucEntity>,
  ) {}

  async findUsers(): Promise<any> {
    const users = await this.userRepository.createQueryBuilder('users').getRawMany();

    return {
      users,
    };
  }

  async findRegulationResults(rucNumber: string): Promise<any> {
    const users = await this.userRepository.createQueryBuilder('users').getRawMany();
    const ruc = await this.rucRepository.findOne({ where: { number: rucNumber } });

    return {
      users,
      ruc,
    };
  }
}
