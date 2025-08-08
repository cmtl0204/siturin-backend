import { IsArray, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { CategoryEntity } from '@modules/core/entities';
import { CreateRegulationResponseDto } from '@modules/core/shared-core/dto/process/create-regulation-response.dto';
import { Type } from 'class-transformer';

export class CreateRegulationDto {
  @IsOptional()
  category: CategoryEntity;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateRegulationResponseDto)
  regulationResponses: CreateRegulationResponseDto[];
}
