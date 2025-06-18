import { ObjectLiteral, Repository } from 'typeorm';
import { PaginationDto } from '../dto';
import { ServiceResponseHttpInterface } from '../interfaces';

export class PaginateFilterService<T extends ObjectLiteral> {
  constructor(private readonly repository: Repository<T>) {}

  async execute(
    params: PaginationDto,
    searchFields: (keyof T)[] = [],
  ): Promise<ServiceResponseHttpInterface> {
    const { search, page, limit } = params;

    const queryBuilder = this.repository.createQueryBuilder('entity');

    if (search) {
      const whereConditions = searchFields.map(
        (field) => `entity.${field.toString()} ILIKE :search`,
      );
      queryBuilder.where(whereConditions.join(' OR '), {
        search: `%${search.trim()}%`,
      });
    }

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
