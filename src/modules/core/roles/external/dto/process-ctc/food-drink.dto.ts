import { IsNotEmpty, IsOptional, IsPositive, ValidateNested } from 'class-validator';
import { isPositiveValidationOptions } from '@utils/dto-validation';
import { CreateRegulationDto } from '@modules/core/shared-core/dto/process/create-regulation.dto';
import { Type } from 'class-transformer';

export class FoodDrinkDto {
  @IsOptional()
  @IsPositive(isPositiveValidationOptions())
  readonly totalCapacities: number;

  @IsOptional()
  @IsPositive(isPositiveValidationOptions())
  readonly totalTables: number;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateRegulationDto)
    readonly regulation: CreateRegulationDto;
}
