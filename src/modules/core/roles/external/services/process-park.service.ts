import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigEnum } from '@utils/enums';
import { DataSource, EntityManager } from 'typeorm';
import { CreateRegistrationProcessParkDto } from '@modules/core/roles/external/dto/process-park';
import { UserEntity } from '@auth/entities';
import { ResponseHttpInterface } from '@utils/interfaces';
import { ProcessEntity, ProcessParkEntity } from '@modules/core/entities';

@Injectable()
export class ProcessParkService {
  constructor(
    @Inject(ConfigEnum.PG_DATA_SOURCE)
    private readonly dataSource: DataSource,
  ) {}

  async createRegistration(
    payload: CreateRegistrationProcessParkDto,
    user: UserEntity,
  ): Promise<ResponseHttpInterface> {
    return await this.dataSource.transaction(async (manager) => {
      const process = await this.saveProcess(payload, manager);

      await this.saveProcessPark(payload, manager);

      return {
        data: process,
        message: 'Proceso de parque registrado correctamente',
        title: 'Registro exitoso',
      };
    });
  }

  private async saveProcess(
    payload: CreateRegistrationProcessParkDto,
    manager: EntityManager,
  ): Promise<ProcessEntity> {
    const processRepository = manager.getRepository(ProcessEntity);

    const process = await processRepository.findOne({
      where: { id: payload.processId },
    });

    if (!process) {
      throw new NotFoundException('Trámite no encontrado');
    }

    process.activityId = payload.activity.id;
    process.classificationId = payload.classification.id;
    process.categoryId = payload.category.id;

    process.isProtectedArea = payload.isProtectedArea;
    process.hasProtectedAreaContract = payload.hasProtectedAreaContract;

    return await processRepository.save(process);
  }

  private async saveProcessPark(
    payload: CreateRegistrationProcessParkDto,
    manager: EntityManager,
  ): Promise<ProcessParkEntity> {
    const processParkRepository = manager.getRepository(ProcessParkEntity);

    let processPark = await processParkRepository.findOne({
      where: { processId: payload.processId },
    });

    if (!processPark) {
      processPark = processParkRepository.create();
    }

    processPark.processId = payload.processId;
    processPark.totalCapacities = payload.totalCapacities;

    return await processParkRepository.save(processPark);
  }
}
