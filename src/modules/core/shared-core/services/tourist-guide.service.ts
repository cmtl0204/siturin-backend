import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CoreRepositoryEnum } from '@utils/enums';
import { ServiceResponseHttpInterface } from '@utils/interfaces';
import { TouristGuideEntity } from '@modules/core/entities';
import { UpdateCadastreDto } from '@modules/core/dac/dto/cadastre';
import { PaginationDto } from '@utils/dto';
import { PaginateFilterService } from '@utils/pagination/paginate-filter.service';
import {
  CreateTouristGuideDto,
  UpdateTouristGuideDto,
} from '@modules/core/shared-core/dto/tourist-guide';

@Injectable()
export class TouristGuideService {
  private paginateFilterService: PaginateFilterService<TouristGuideEntity>;

  constructor(
    @Inject(CoreRepositoryEnum.TOURIST_GUIDE_REPOSITORY)
    private repository: Repository<TouristGuideEntity>,
  ) {
    this.paginateFilterService = new PaginateFilterService(this.repository);
  }

  async create(
    payload: CreateTouristGuideDto,
  ): Promise<TouristGuideEntity> {
    const entity = this.repository.create(payload);

    return await this.repository.save(entity);
  }

  async findAll(params: PaginationDto): Promise<ServiceResponseHttpInterface> {
    return this.paginateFilterService.execute(params, [
      'identification',
      'name',
    ]);
  }

  async findOne(id: string): Promise<ServiceResponseHttpInterface> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('Registro no encontrado');
    }

    return { data: entity };
  }

  async update(
    id: string,
    payload: UpdateTouristGuideDto,
  ): Promise<TouristGuideEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException('Registro no encontrado');
    }

    this.repository.merge(entity, payload);

    return await this.repository.save(entity);
  }

  async delete(id: string): Promise<TouristGuideEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException('Registro no encontrado');
    }

    return await this.repository.softRemove(entity);
  }
}
