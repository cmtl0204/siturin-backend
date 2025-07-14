import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ConfigEnum, CoreRepositoryEnum } from '@utils/enums';
import { ServiceResponseHttpInterface } from '@utils/interfaces';
import { ProcessAgencyEntity, ProcessEntity } from '@modules/core/entities';
import { PaginationDto } from '@utils/dto';
import { PaginateFilterService } from '@utils/pagination/paginate-filter.service';
import { FindTouristGuideDto } from '@modules/core/shared-core/dto/tourist-guide/find-tourist-guide.dto';
import {
  CreateProcessAgencyDto,
  UpdateProcessAgencyDto,
} from '@modules/core/roles/external/dto/process-agency';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import { ProcessService } from '@modules/core/shared-core/services/process.service';
import { UserEntity } from '@auth/entities';
import { addDays, set } from 'date-fns';

@Injectable()
export class ProcessAgencyService {
  private paginateFilterService: PaginateFilterService<ProcessAgencyEntity>;

  constructor(
    @Inject(ConfigEnum.PG_DATA_SOURCE)
    private readonly dataSource: DataSource,
    @Inject(CoreRepositoryEnum.PROCESS_REPOSITORY)
    private readonly processRepository: Repository<ProcessEntity>,
    @Inject(CoreRepositoryEnum.PROCESS_AGENCY_REPOSITORY)
    private readonly processAgencyRepository: Repository<ProcessAgencyEntity>,
    private readonly processService: ProcessService,
  ) {
    this.paginateFilterService = new PaginateFilterService(this.processAgencyRepository);
  }

  async findAll(params: PaginationDto): Promise<ServiceResponseHttpInterface> {
    return this.paginateFilterService.execute(params, ['process']);
  }

  async findOne(id: string, options: FindTouristGuideDto): Promise<ProcessAgencyEntity> {
    const entity = await this.processAgencyRepository.findOne({
      where: { id },
      relations: options.relations,
    });

    if (!entity) {
      throw new NotFoundException('Registro no encontrado');
    }

    return entity;
  }

  async create(payload: CreateProcessAgencyDto): Promise<ProcessAgencyEntity> {
    const entity = this.processAgencyRepository.create(payload);

    return await this.processAgencyRepository.save(entity);
  }

  async update(id: string, payload: UpdateProcessAgencyDto): Promise<ProcessAgencyEntity> {
    const entity = await this.findEntityOrThrow(id);

    this.processAgencyRepository.merge(entity, payload);

    return await this.processAgencyRepository.save(entity);
  }

  async delete(id: string): Promise<ProcessAgencyEntity> {
    const entity = await this.findEntityOrThrow(id);

    return await this.processAgencyRepository.softRemove(entity);
  }

  private async findEntityOrThrow(id: string): Promise<ProcessAgencyEntity> {
    const entity = await this.processAgencyRepository.findOneBy({ id });

    if (!entity) throw new NotFoundException('Registro no encontrado');

    return entity;
  }

  async registration(payload: CreateProcessAgencyDto, user: UserEntity): Promise<ProcessEntity> {
    return await this.dataSource.transaction(async (manager) => {
      const processRepository = manager.getRepository(ProcessEntity);
      const processAgencyRepository = manager.getRepository(ProcessAgencyEntity);
      const catalogueRepository = manager.getRepository(CatalogueEntity);

      const process = await processRepository.findOne({
        where: { id: payload.processId },
        relations: { establishmentAddress: true },
      });
      // review
      const state = await catalogueRepository.findOneBy({
        code: 'pendiente_inspeccion_1',
        type: 'tramite_estados',
      });

      if (!process) {
        throw new NotFoundException('Registro no encontrado');
      }

      if (state) process.stateId = state.id;
      process.activityId = payload.activity.id;
      process.classificationId = payload.classification.id;
      process.categoryId = payload.category.id;
      process.hasLandUse = payload.hasLandUse;
      process.registeredAt = new Date();
      process.endedAt = new Date();
      process.isProtectedArea = payload.isProtectedArea;
      process.hasProtectedAreaContract = payload.hasProtectedAreaContract;

      await this.processService.saveAutoInspection(payload, manager, user);
      await this.processService.saveAutoAssignment(
        payload.processId,
        process.establishmentAddress.provinceId,
        manager,
      );

      process.inspectionExpirationAt = set(addDays(new Date(), 114), {
        hours: 23,
        minutes: 23,
        seconds: 59,
        milliseconds: 0,
      });

      let processAgency = await processAgencyRepository.findOneBy({ processId: payload.processId });

      if (!processAgency) {
        processAgency = processAgencyRepository.create();
      }

      processAgency.processId = payload.processId;
      processAgency.permanentPhysicalSpaceId = payload.permanentPhysicalSpace.id;
      processAgency.totalAccreditedStaffLanguage = payload.totalAccreditedStaffLanguage;
      processAgency.percentageAccreditedStaffLanguage = payload.percentageAccreditedStaffLanguage;

      await processAgencyRepository.save(processAgency);

      return await processRepository.save(process);
    });
  }
}
