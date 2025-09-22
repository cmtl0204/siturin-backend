import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@utils/dto';

export class FilterAdventureTourismModalityDto extends PaginationDto {
  @IsOptional()
  @IsString()
  readonly processId: string;

  @IsOptional()
  @IsString()
  readonly typeId: string;
}
