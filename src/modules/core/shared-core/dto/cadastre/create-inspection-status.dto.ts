import { IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import { CatalogueDto } from '@modules/common/catalogue/dto';

export class CreateInspectionStatusDto {
  @IsUUID()
  readonly cadastreId: string;

  @IsOptional()
  @Type(() => CatalogueDto)
  readonly state: CatalogueEntity;
}
