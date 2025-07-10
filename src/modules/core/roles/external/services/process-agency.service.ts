import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CoreRepositoryEnum } from '@utils/enums';
import { ServiceResponseHttpInterface } from '@utils/interfaces';
import { ProcessAgencyEntity } from '@modules/core/entities';
import { PaginationDto } from '@utils/dto';
import { PaginateFilterService } from '@utils/pagination/paginate-filter.service';
import { FindTouristGuideDto } from '@modules/core/shared-core/dto/tourist-guide/find-tourist-guide.dto';
import {
  CreateProcessAgencyDto,
  UpdateProcessAgencyDto,
} from '@modules/core/roles/external/dto/process-agency';

@Injectable()
export class ProcessAgencyService {
  private paginateFilterService: PaginateFilterService<ProcessAgencyEntity>;

  constructor(
    @Inject(CoreRepositoryEnum.PROCESS_AGENCY_REPOSITORY)
    private readonly repository: Repository<ProcessAgencyEntity>,
  ) {
    this.paginateFilterService = new PaginateFilterService(this.repository);
  }

  async findAll(params: PaginationDto): Promise<ServiceResponseHttpInterface> {
    return this.paginateFilterService.execute(params, ['process']);
  }

  async findOne(id: string, options: FindTouristGuideDto): Promise<ProcessAgencyEntity> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: options.relations,
    });

    if (!entity) {
      throw new NotFoundException('Registro no encontrado');
    }

    return entity;
  }

  async create(payload: CreateProcessAgencyDto): Promise<ProcessAgencyEntity> {
    const entity = this.repository.create(payload);

    return await this.repository.save(entity);
  }

  async update(id: string, payload: UpdateProcessAgencyDto): Promise<ProcessAgencyEntity> {
    const entity = await this.findEntityOrThrow(id);

    this.repository.merge(entity, payload);

    return await this.repository.save(entity);
  }

  async delete(id: string): Promise<ProcessAgencyEntity> {
    const entity = await this.findEntityOrThrow(id);

    return await this.repository.softRemove(entity);
  }

  private async findEntityOrThrow(id: string): Promise<ProcessAgencyEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) throw new NotFoundException('Registro no encontrado');

    return entity;
  }
}
