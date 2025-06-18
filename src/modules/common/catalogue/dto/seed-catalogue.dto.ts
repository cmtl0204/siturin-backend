import { CatalogueDto } from './catalogue.dto';
import { IsBoolean } from 'class-validator';
import { isBooleanValidationOptions } from '../../../../utils/dto-validation';

export class SeedCatalogueDto extends CatalogueDto {
  @IsBoolean(isBooleanValidationOptions())
  readonly required: boolean;
}
