import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../../../utils/dto';

export class FilterCadastreDto extends PaginationDto {
  @IsOptional()
  @IsString()
  readonly registerNumber: string;

  @IsOptional()
  @IsString()
  readonly systemOrigin: string;
}
