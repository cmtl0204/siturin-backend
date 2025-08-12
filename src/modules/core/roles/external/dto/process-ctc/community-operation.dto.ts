import { IsArray, IsBoolean, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { isBooleanValidationOptions } from '@utils/dto-validation';
import { Type } from 'class-transformer';
import { TouristGuideDto } from '@modules/core/shared-core/dto/process';
import { CreateAdventureTourismModalityDto } from '@modules/core/shared-core/dto/adventure-tourism-modality';
import { CreateRegulationDto } from '@modules/core/shared-core/dto/process/create-regulation.dto';

export class CommunityOperationDto {
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateAdventureTourismModalityDto)
  readonly adventureTourismModalities: CreateAdventureTourismModalityDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => TouristGuideDto)
  readonly touristGuides: TouristGuideDto[];

  @IsBoolean(isBooleanValidationOptions())
  readonly hasAdventureTourismModality: boolean;

  @IsBoolean(isBooleanValidationOptions())
  readonly hasTouristGuide: boolean;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateRegulationDto)
  readonly regulation: CreateRegulationDto;
}
