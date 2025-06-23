import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import {
  CreateCatalogueDto,
  FilterCatalogueDto,
  UpdateCatalogueDto,
} from '@modules/common/catalogue/dto';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import { CacheEnum, CatalogueTypeEnum, CommonRepositoryEnum } from '../../../utils/enums';
import { ServiceResponseHttpInterface } from '../../../utils/interfaces';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class LocationService {
  clientRedis: any = null;

  constructor(
    @Inject(CommonRepositoryEnum.CATALOGUE_REPOSITORY)
    private repository: Repository<CatalogueEntity>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(payload: CreateCatalogueDto): Promise<CatalogueEntity> {
    const newCatalogue = this.repository.create(payload);

    return await this.repository.save(newCatalogue);
  }

  async catalogue(type: CatalogueTypeEnum): Promise<CatalogueEntity[]> {
    const data = await this.repository.find({
      where: { type },
    });

    return data;
  }

  async findAll(params?: FilterCatalogueDto): Promise<ServiceResponseHttpInterface> {
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

  async findByType(type: string) {
    const catalogue = await this.repository.find({
      where: { type },
    });

    if (!catalogue) {
      throw new NotFoundException('Catalogue not found');
    }

    return catalogue;
  }

  async update(id: string, payload: UpdateCatalogueDto) {
    const catalogue = await this.repository.findOneBy({ id });

    if (!catalogue) {
      throw new NotFoundException('Catalogue not found');
    }

    this.repository.merge(catalogue, payload);

    return this.repository.save(catalogue);
  }

  async remove(id: string): Promise<CatalogueEntity> {
    const catalogue = await this.repository.findOneBy({ id });

    if (!catalogue) {
      throw new NotFoundException('Catalogue not found');
    }

    return await this.repository.softRemove(catalogue);
  }

  async removeAll(payload: CatalogueEntity[]): Promise<CatalogueEntity[]> {
    return await this.repository.softRemove(payload);
  }

  async findCache(): Promise<CatalogueEntity[]> {
    let catalogues = (await this.cacheManager.get(CacheEnum.CATALOGUES)) as CatalogueEntity[];

    if (catalogues === null || catalogues === undefined || catalogues.length === 0) {
      catalogues = await this.repository.find({
        relations: { children: true },
        where: { parent: IsNull() },
        order: { type: 'asc', sort: 'asc', name: 'asc' },
      });

      await this.cacheManager.set(CacheEnum.CATALOGUES, catalogues);
    }

    return catalogues;
  }

  async loadCache(): Promise<CatalogueEntity[]> {
    const catalogues = await this.repository.find({
      relations: { children: true },
      where: { parent: IsNull() },
      order: { type: 'asc', sort: 'asc', name: 'asc' },
    });

    await this.cacheManager.set(CacheEnum.CATALOGUES, catalogues);

    return catalogues;
  }
}
