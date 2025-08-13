import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CatalogueDto } from '@modules/common/catalogue/dto';
import { CategoryEntity, ClassificationEntity } from '@modules/core/entities';

export class CreateReclassifiedInspectionStatusDto {
  @IsNotEmpty()
  @IsUUID()
  readonly cadastreId: string;

  @IsNotEmpty()
  @Type(() => CatalogueDto)
  readonly state: CatalogueDto;

  @IsNotEmpty()
  @Type(() => ClassificationEntity)
  readonly classification: ClassificationEntity;

  @IsNotEmpty()
  @Type(() => CategoryEntity)
  readonly category: CategoryEntity;
}
