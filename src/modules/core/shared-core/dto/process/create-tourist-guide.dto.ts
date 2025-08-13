import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { isBooleanValidationOptions, isStringValidationOptions } from '@utils/dto-validation';
import { TouristLicenseEntity } from '@modules/core/entities';

export class CreateTouristGuideDto {
  @IsString(isStringValidationOptions())
  readonly identification: string;

  @IsString(isStringValidationOptions())
  readonly name: string;

  @IsBoolean(isBooleanValidationOptions())
  readonly isGuide: boolean;

  @IsOptional()
  readonly touristLicenses: TouristLicenseEntity[];
}
