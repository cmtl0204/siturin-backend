import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CatalogueDto } from '@modules/common/catalogue/dto';
import { InactivationCauseDto } from '@modules/core/shared-core/dto/process';

export class CreateInactivationInspectionStatusDto {
  @IsNotEmpty()
  @IsUUID()
  readonly cadastreId: string;

  @IsNotEmpty()
  @IsUUID()
  readonly processId: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CatalogueDto)
  readonly state: CatalogueDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CatalogueDto)
  readonly causeInactivationType: CatalogueDto;

  @IsArray()
  @ValidateNested()
  @Type(() => InactivationCauseDto)
  readonly inactivationCauses: InactivationCauseDto[];
}
