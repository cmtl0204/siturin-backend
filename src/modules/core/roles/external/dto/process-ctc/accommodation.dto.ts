import { IsNotEmpty, IsOptional, IsPositive, ValidateNested } from 'class-validator';
import { isPositiveValidationOptions } from '@utils/dto-validation';
import { CreateRegulationDto } from '@modules/core/shared-core/dto/process/create-regulation.dto';
import { Type } from 'class-transformer';

export class AccommodationDto {
  @IsOptional()
  @IsPositive(isPositiveValidationOptions())
  readonly totalBeds: number;

  @IsOptional()
  @IsPositive(isPositiveValidationOptions())
  readonly totalPlaces: number;

  @IsOptional()
  @IsPositive(isPositiveValidationOptions())
  readonly totalRooms: number;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateRegulationDto)
    readonly regulation: CreateRegulationDto;
}
