import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CoreRepositoryEnum } from '../../../../utils/enums';
import { ServiceResponseHttpInterface } from '../../../../utils/interfaces';
import { CadastreEntity } from '@modules/core/entities';
import {
  CreateCadastreDto,
  UpdateCadastreDto,
} from '@modules/core/dac/dto/cadastre';
import { PaginationDto } from '../../../../utils/dto';
import { PaginateFilterService } from '../../../../utils/pagination/paginate-filter.service';

@Injectable()
export class CadastreService {
  private paginateFilterService: PaginateFilterService<CadastreEntity>;

  constructor(
    @Inject(CoreRepositoryEnum.CADASTRE_REPOSITORY)
    private repository: Repository<CadastreEntity>,
  ) {
    this.paginateFilterService = new PaginateFilterService(this.repository);
  }

  async create(
    payload: CreateCadastreDto,
  ): Promise<ServiceResponseHttpInterface> {
    const entity = this.repository.create(payload);

    return { data: await this.repository.save(entity) };
  }

  async findAll(params: PaginationDto): Promise<ServiceResponseHttpInterface> {
    return this.paginateFilterService.execute(params, [
      'registerNumber',
      'systemOrigin',
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
    payload: UpdateCadastreDto,
  ): Promise<ServiceResponseHttpInterface> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException('Registro no encontrado');
    }

    this.repository.merge(entity, payload);

    return { data: await this.repository.save(entity) };
  }

  async remove(id: string): Promise<ServiceResponseHttpInterface> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException('Registro no encontrado');
    }

    return { data: await this.repository.softRemove(entity) };
  }
}
