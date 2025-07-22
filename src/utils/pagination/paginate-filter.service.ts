import { ObjectLiteral, Repository } from 'typeorm';
import { PaginationDto } from '../dto';
import { ServiceResponseHttpInterface } from '../interfaces';

export class PaginateFilterService<T extends ObjectLiteral> {
  constructor(private readonly repository: Repository<T>) {}

  async execute(
    params: PaginationDto,
    searchFields: (keyof T)[] = [],
    relations: string[] = [],
  ): Promise<ServiceResponseHttpInterface> {
    const { search, page, limit } = params;

    const queryBuilder = this.repository.createQueryBuilder('entity');

    // Agregar joins dinámicamente
    for (const relation of relations) {
      queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
    }

    // Agregar condiciones de búsqueda
    if (search) {
      const whereConditions = searchFields.map(
        (field) => `entity.${field.toString()} ILIKE :search`,
      );
      queryBuilder.where(whereConditions.join(' OR '), {
        search: `%${search.trim()}%`,
      });
    }

    // Ordenar, paginar y ejecutar
    queryBuilder
      .orderBy('entity.createdAt', 'DESC')
      .skip(PaginationDto.getOffset(limit, page))
      .take(limit);

    const [data, totalItems] = await queryBuilder.getManyAndCount();

    return {
      data,
      pagination: { limit, totalItems },
    };
  }
}
