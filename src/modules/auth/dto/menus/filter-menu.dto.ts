import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../../utils/dto';

export class FilterMenuDto extends PaginationDto {
  @IsOptional()
  @IsString()
  readonly name: string;
}
