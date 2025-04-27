import { IsNotEmpty, IsString } from 'class-validator';
import {
  isNotEmptyValidationOptions,
  isStringValidationOptions,
} from '@shared/dto-validation';

export class SignInDto {
  @IsString(isStringValidationOptions())
  @IsNotEmpty(isNotEmptyValidationOptions())
  username: string;

  @IsString(isStringValidationOptions())
  @IsNotEmpty()
  password: string;
}
