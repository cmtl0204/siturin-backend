import { IsBoolean, IsString } from 'class-validator';
import { isBooleanValidationOptions, isStringValidationOptions } from '@utils/dto-validation';

export class TouristGuideDto {
  @IsString(isStringValidationOptions())
  readonly identification: string;

  @IsString(isStringValidationOptions())
  readonly name: string;

  @IsBoolean(isBooleanValidationOptions())
  readonly isGuide: boolean;
}
