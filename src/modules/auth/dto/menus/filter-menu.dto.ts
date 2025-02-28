import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@shared/dto';

export class FilterMenuDto extends PaginationDto {
  @IsOptional()
  @IsString()
  readonly name: string;
}
