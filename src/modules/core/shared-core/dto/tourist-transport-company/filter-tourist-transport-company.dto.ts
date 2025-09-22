import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@utils/dto';

export class FilterTouristTransportCompanyDto extends PaginationDto {
  @IsOptional()
  @IsString()
  readonly ruc?: string;

  @IsOptional()
  @IsString()
  readonly legalName?: string;
}
