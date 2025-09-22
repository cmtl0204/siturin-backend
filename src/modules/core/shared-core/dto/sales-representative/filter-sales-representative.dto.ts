import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@utils/dto';

export class FilterSalesRepresentativeDto extends PaginationDto {
  @IsOptional()
  @IsString()
  readonly ruc?: string;

  @IsOptional()
  @IsString()
  readonly legalName?: string;

}
