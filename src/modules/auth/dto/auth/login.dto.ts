import { IsNotEmpty, IsString } from 'class-validator';
import {
  isNotEmptyValidationOptions,
  isStringValidationOptions,
} from '@shared/dto-validation';

export class LoginDto {
  @IsString(isStringValidationOptions())
  @IsNotEmpty(isNotEmptyValidationOptions())
  username: string;

  @IsString(isStringValidationOptions())
  @IsNotEmpty()
  password: string;
}
