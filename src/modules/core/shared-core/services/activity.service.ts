import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CoreRepositoryEnum } from '@utils/enums';
import { ServiceResponseHttpInterface } from '@utils/interfaces';
import { ActivityEntity } from '@modules/core/entities';
import { PaginationDto } from '@utils/dto';
import { PaginateFilterService } from '@utils/pagination/paginate-filter.service';
import {
  CreateActivityDto,
  FindActivityDto,
  UpdateActivityDto,
} from '@modules/core/shared-core/dto/activity';

@Injectable()
export class ActivityService {
  private paginateFilterService: PaginateFilterService<ActivityEntity>;

  constructor(
    @Inject(CoreRepositoryEnum.ACTIVITY_REPOSITORY)
    private readonly repository: Repository<ActivityEntity>,
  ) {
    this.paginateFilterService = new PaginateFilterService(this.repository);
  }

  async findAll(params: PaginationDto): Promise<ServiceResponseHttpInterface> {
    return this.paginateFilterService.execute(params, ['name']);
  }

  async findOne(id: string, options: FindActivityDto): Promise<ActivityEntity> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: options.relations,
    });

    if (!entity) {
      throw new NotFoundException('Registro no encontrado');
    }

    return entity;
  }

  async create(payload: CreateActivityDto): Promise<ActivityEntity> {
    const entity = this.repository.create(payload);

    return await this.repository.save(entity);
  }

  async update(id: string, payload: UpdateActivityDto): Promise<ActivityEntity> {
    const entity = await this.findEntityOrThrow(id);

    this.repository.merge(entity, payload);

    return await this.repository.save(entity);
  }

  async delete(id: string): Promise<ActivityEntity> {
    const entity = await this.findEntityOrThrow(id);

    return await this.repository.softRemove(entity);
  }

  private async findEntityOrThrow(id: string): Promise<ActivityEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) throw new NotFoundException('Registro no encontrado');

    return entity;
  }
}
