import { IsArray, IsNotEmpty, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CatalogueDto } from '@modules/common/catalogue/dto';
import { BreachCauseDto, TouristGuideDto } from '@modules/core/shared-core/dto/process';

export class CreateTemporarySuspensionInspectionStatusDto {
  @IsNotEmpty()
  @IsUUID()
  readonly cadastreId: string;

  @IsNotEmpty()
  @Type(() => CatalogueDto)
  readonly state: CatalogueDto;

  @IsArray()
  @Type(() => BreachCauseDto)
  readonly breachCauses: BreachCauseDto[];
}
