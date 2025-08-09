import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPositive,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { isBooleanValidationOptions, isPositiveValidationOptions } from '@utils/dto-validation';
import { Type } from 'class-transformer';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import { ActivityEntity, CategoryEntity, ClassificationEntity } from '@modules/core/entities';
import { TouristGuideDto } from '@modules/core/shared-core/dto/process';
import { CatalogueDto } from '@modules/common/catalogue/dto';
import { CreateRegulationDto } from '@modules/core/shared-core/dto/process/create-regulation.dto';
import { CreateAdventureTourismModalityDto } from '@modules/core/shared-core/dto/adventure-tourism-modality';

export class CreateRegistrationProcessAgencyDto {
  @IsUUID()
  readonly processId: string;

  @IsObject()
  @Type(() => CatalogueEntity)
  readonly type: CatalogueEntity;

  @IsObject()
  @Type(() => ActivityEntity)
  readonly activity: ActivityEntity;

  @IsObject()
  @Type(() => ClassificationEntity)
  readonly classification: ClassificationEntity;

  @IsObject()
  @Type(() => CategoryEntity)
  readonly category: CategoryEntity;

  @IsOptional()
  @IsObject()
  @Type(() => CatalogueDto)
  readonly localType: CatalogueDto;

  @IsObject()
  @Type(() => CatalogueDto)
  readonly permanentPhysicalSpace: CatalogueDto;

  @IsPositive(isPositiveValidationOptions())
  readonly totalAccreditedStaffLanguage: number;

  @IsPositive(isPositiveValidationOptions())
  readonly percentageAccreditedStaffLanguage: number;

  @IsBoolean(isBooleanValidationOptions())
  readonly hasLandUse: boolean;

  @IsBoolean(isBooleanValidationOptions())
  readonly isProtectedArea: boolean;

  @IsBoolean(isBooleanValidationOptions())
  readonly hasProtectedAreaContract: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => TouristGuideDto)
  readonly touristGuides: TouristGuideDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateAdventureTourismModalityDto)
  readonly adventureTourismModalities: CreateAdventureTourismModalityDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateRegulationDto)
  readonly regulation: CreateRegulationDto;
}
