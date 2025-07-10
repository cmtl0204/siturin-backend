import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../../../utils/dto';

export class FilterActivityDto extends PaginationDto {
  @IsOptional()
  @IsString()
  readonly registerNumber: string;

  @IsOptional()
  @IsString()
  readonly systemOrigin: string;
}
