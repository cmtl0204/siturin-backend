import { IsArray, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { isBooleanValidationOptions } from '@utils/dto-validation';
import { Type } from 'class-transformer';
import { CatalogueDto } from '@modules/common/catalogue/dto';
import { TouristGuideDto } from '@modules/core/shared-core/dto/process';

export class CommunityOperationDto {
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => CatalogueDto)
  readonly adventureTourismModalities: CatalogueDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => TouristGuideDto)
  readonly touristGuides: TouristGuideDto[];

  @IsBoolean(isBooleanValidationOptions())
  readonly hasAdventureTourismModality: boolean;

  @IsBoolean(isBooleanValidationOptions())
  readonly hasTouristGuide: boolean;
}
