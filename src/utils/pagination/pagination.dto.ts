import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import {
  isNotEmptyValidationOptions,
  isPositiveValidationOptions,
  isStringValidationOptions,
} from '../dto-validation';

export class PaginationDto {
  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsPositive(isPositiveValidationOptions())
  limit: number;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsPositive(isPositiveValidationOptions())
  page: number;

  @IsOptional()
  @IsString(isStringValidationOptions())
  search: string;

  static getOffset(limit: number, page: number): number {
    page = page < 1 ? 1 : page - 1;
    return page * limit;
  }
}
