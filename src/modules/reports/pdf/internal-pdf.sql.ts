import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuthRepositoryEnum, CoreRepositoryEnum } from '@utils/enums';
import { CadastreEntity, ProcessEntity, RucEntity } from '@modules/core/entities';
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
    @Inject(CoreRepositoryEnum.PROCESS_REPOSITORY)
    private readonly processRepository: Repository<ProcessEntity>,
  ) {}

  async findUsers(): Promise<any> {
    const users = await this.userRepository.createQueryBuilder('users').getRawMany();

    return {
      users,
    };
  }

  async findRegisterCertificate(cadastreId: string): Promise<any> {
    const cadastre = await this.cadastreRepository.findOne({
      relations: {
        process: {
          classification: true,
          category: true,
          establishmentAddress: { province: { zone: true }, canton: true, parish: true },
          establishment: { ruc: true },
        },
        cadastreState: true,
      },
      where: { id: cadastreId },
      order: {
        cadastreState: { isCurrent: 'desc' },
        process: { establishmentAddress: { isCurrent: 'desc' } },
      },
    });

    const processes = await this.processRepository.find({
      where: { establishmentId: cadastre?.process.establishmentId },
    });

    return {
      cadastre,
      processes,
    };
  }
}
