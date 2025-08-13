import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { isStringValidationOptions } from '@utils/dto-validation';
import { Type } from 'class-transformer';
import { CatalogueDto } from '@modules/common/catalogue/dto';

export class CreateTouristTransportCompanyDto {
  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly id: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly ruc: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly legalName: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly authorizationNumber: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CatalogueDto)
  readonly rucType: CatalogueDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CatalogueDto)
  readonly type: CatalogueDto;
}
