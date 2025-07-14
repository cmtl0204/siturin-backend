import { IsDate, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { isDateValidationOptions, isStringValidationOptions } from '@utils/dto-validation';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';

export class CreateInspectionDto {
  @IsUUID()
  readonly processId: string;

  @IsDate(isDateValidationOptions())
  readonly inspectionAt: Date;

  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly state: string;
}
