import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ConfigEnum, CoreRepositoryEnum } from '@utils/enums';
import { ServiceResponseHttpInterface } from '@utils/interfaces';
import { EstablishmentEntity, ProcessEntity } from '@modules/core/entities';
import { PaginationDto } from '@utils/dto';
import { PaginateFilterService } from '@utils/pagination/paginate-filter.service';
import { FindTouristGuideDto } from '@modules/core/shared-core/dto/tourist-guide/find-tourist-guide.dto';
import {
  CreateProcessAgencyDto,
  UpdateProcessAgencyDto,
} from '@modules/core/roles/external/dto/process-agency';
import {
  CreateStep1Dto,
  CreateStep2Dto,
  CreateStep2EstablishmentDto,
} from '@modules/core/shared-core/dto/process';

@Injectable()
export class ProcessService {
  private paginateFilterService: PaginateFilterService<ProcessEntity>;

  constructor(
    @Inject(ConfigEnum.PG_DATA_SOURCE)
    private readonly dataSource: DataSource,
    @Inject(CoreRepositoryEnum.PROCESS_REPOSITORY)
    private readonly repository: Repository<ProcessEntity>,
    @Inject(CoreRepositoryEnum.ESTABLISHMENT_REPOSITORY)
    private readonly establishmentRepository: Repository<EstablishmentEntity>,
  ) {
    this.paginateFilterService = new PaginateFilterService(this.repository);
  }

  async findAll(params: PaginationDto): Promise<ServiceResponseHttpInterface> {
    return this.paginateFilterService.execute(params, []);
  }

  async findOne(id: string, options: FindTouristGuideDto): Promise<ProcessEntity> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: options.relations,
    });

    if (!entity) {
      throw new NotFoundException('Registro no encontrado');
    }

    return entity;
  }

  async create(payload: CreateProcessAgencyDto): Promise<ProcessEntity> {
    const entity = this.repository.create(payload);

    return await this.repository.save(entity);
  }

  async update(id: string, payload: UpdateProcessAgencyDto): Promise<ProcessEntity> {
    const entity = await this.findEntityOrThrow(id);

    this.repository.merge(entity, payload);

    return await this.repository.save(entity);
  }

  async delete(id: string): Promise<ProcessEntity> {
    const entity = await this.findEntityOrThrow(id);

    return await this.repository.softRemove(entity);
  }

  private async findEntityOrThrow(id: string): Promise<ProcessEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) throw new NotFoundException('Registro no encontrado');

    return entity;
  }

  async createStep1(payload: CreateStep1Dto): Promise<ProcessEntity> {
    let process = await this.repository.findOneBy({ id: payload?.processId });

    if (!process) {
      process = this.repository.create();
    }

    console.log(process);

    process.createdAt = new Date();
    process.legalEntityId = payload.legalEntity.id;
    process.hasTouristActivityDocument = payload.hasTouristActivityDocument;
    process.hasPersonDesignation = payload.hasPersonDesignation;
    process.typeId = payload.type.id;

    return await this.repository.save(process);
  }

  async createStep2(payload: CreateStep2Dto): Promise<ProcessEntity> {
    return await this.dataSource.transaction(async (manager) => {
      const processRepository = manager.getRepository(ProcessEntity);

      const process = await processRepository.findOneBy({ id: payload?.processId });

      if (!process) {
        throw new NotFoundException('Trámite no encontrado');
      }

      process.createdAt = new Date();

      await this.saveEstablishment(payload, manager);

      return await processRepository.save(process);
    });
  }

  private async saveEstablishment(payload: CreateStep2Dto, manager: EntityManager) {
    const establishmentRepository = manager.getRepository(EstablishmentEntity);

    const establishment = await establishmentRepository.findOneBy({
      id: payload.establishment.id,
    });

    if (!establishment) {
      throw new NotFoundException('Establecimiento no encontrado');
    }

    establishment.webPage = payload.establishment.webPage;

    return establishmentRepository.save(establishment);
  }
}
