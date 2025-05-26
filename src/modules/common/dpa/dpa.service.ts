import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';
import {
  FilterCatalogueDto,
  UpdateCatalogueDto,
} from '@modules/common/catalogue/dto';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import { CacheEnum, CommonRepositoryEnum } from '@shared/enums';
import { ReadUserDto } from '@auth/dto';
import { UserEntity } from '@auth/entities';
import { plainToInstance } from 'class-transformer';
import { ServiceResponseHttpInterface } from '@shared/interfaces';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PaginationDto } from '@shared/dto';
import { DpaEntity } from '@modules/common/dpa/dpa.entity';
import { CreateDpaDto, UpdateDpaDto } from '@modules/common/dpa/dto';

@Injectable()
export class DpaService {
  clientRedis: any = null;

  constructor(
    @Inject(CommonRepositoryEnum.DPA_REPOSITORY)
    private repository: Repository<DpaEntity>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(payload: CreateDpaDto): Promise<DpaEntity> {
    const entity = this.repository.create(payload);

    return await this.repository.save(entity);
  }

  async findAll(
    params?: FilterCatalogueDto,
  ): Promise<ServiceResponseHttpInterface> {
    //All
    const data = await this.repository.findAndCount();

    return { data: data[0], pagination: { totalItems: data[1], limit: 10 } };
  }

  async findOne(id: string) {
    const catalogue = await this.repository.findOne({
      where: { id },
    });

    if (!catalogue) {
      throw new NotFoundException('Catalogue not found');
    }

    return catalogue;
  }

  async findByCode(code: string) {
    const catalogue = await this.repository.findOne({
      where: { code },
    });

    if (!catalogue) {
      throw new NotFoundException('Catalogue not found');
    }

    return catalogue;
  }

  async update(id: string, payload: UpdateDpaDto) {
    const catalogue = await this.repository.findOneBy({ id });

    if (!catalogue) {
      throw new NotFoundException('Catalogue not found');
    }

    this.repository.merge(catalogue, payload);

    return this.repository.save(catalogue);
  }

  async remove(id: string): Promise<DpaEntity> {
    const catalogue = await this.repository.findOneBy({ id });

    if (!catalogue) {
      throw new NotFoundException('Catalogue not found');
    }

    return await this.repository.softRemove(catalogue);
  }
}
