import { IsArray, IsBoolean, IsObject, IsOptional, IsPositive, IsUUID } from 'class-validator';
import { isBooleanValidationOptions, isPositiveValidationOptions } from '@utils/dto-validation';
import { Type } from 'class-transformer';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import {
  ActivityEntity,
  CategoryEntity,
  ClassificationEntity,
  TouristGuideEntity,
} from '@modules/core/entities';
import { TouristGuideDto } from '@modules/core/shared-core/dto/process';

export class CreateProcessAgencyDto {
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
  @Type(() => CatalogueEntity)
  readonly localType: CatalogueEntity;

  @IsObject()
  @Type(() => CatalogueEntity)
  readonly permanentPhysicalSpace: CatalogueEntity;

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
  @Type(() => TouristGuideDto)
  readonly touristGuides: TouristGuideDto[];
}
