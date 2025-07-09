import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  isDateValidationOptions,
  isNotEmptyValidationOptions,
  isStringValidationOptions,
} from '../../../../../utils/dto-validation';
import { ProcessEntity } from '@modules/core/entities';
import { ApiProperty } from '@nestjs/swagger';

export class BaseCadastreDto {
  @ApiProperty()
  @IsOptional()
  readonly process: ProcessEntity;

  @ApiProperty()
  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly idTemp: number;

  @ApiProperty()
  @IsString(isStringValidationOptions())
  readonly idProcess: string;

  @ApiProperty()
  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly observation: string;

  @ApiProperty()
  @IsString(isStringValidationOptions())
  readonly registerNumber: string;

  @ApiProperty()
  @IsDate(isDateValidationOptions())
  readonly registeredAt: Date;

  @ApiProperty()
  @IsString(isStringValidationOptions())
  readonly systemOrigin: string;
}
