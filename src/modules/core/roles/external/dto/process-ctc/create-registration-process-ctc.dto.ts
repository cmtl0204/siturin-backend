import {
  IsArray,
  IsBoolean,
  IsObject,
  IsOptional,
  IsPositive,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import { isBooleanValidationOptions, isPositiveValidationOptions } from '@utils/dto-validation';
import { TouristGuideDto } from '@modules/core/shared-core/dto/process';
import { CatalogueDto } from '@modules/common/catalogue/dto';
import { ActivityEntity, CategoryEntity, ClassificationEntity } from '@modules/core/entities';
import { TransportDto } from '@modules/core/roles/external/dto/process-ctc/transport';
import { AccommodationDto } from '@modules/core/roles/external/dto/process-ctc/accommodation.dto';

export class CreateRegistrationProcessCtcDto {
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
  @IsPositive(isPositiveValidationOptions())
  readonly totalCapacities: number;

  @IsOptional()
  @IsPositive(isPositiveValidationOptions())
  readonly totalTables: number;

  @IsOptional()
  @IsBoolean(isBooleanValidationOptions())
  readonly hasPropertyRegistrationCertificate: boolean;

  @IsOptional()
  @IsBoolean(isBooleanValidationOptions())
  readonly hasTechnicalReport: boolean;

  @IsOptional()
  @IsBoolean(isBooleanValidationOptions())
  readonly hasStatute: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => TouristGuideDto)
  readonly touristGuides: TouristGuideDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => AccommodationDto)
  readonly accommodation: AccommodationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => TransportDto)
  readonly transport: TransportDto;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => CatalogueDto)
  readonly waters: CatalogueDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => CatalogueDto)
  readonly airs: CatalogueDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => CatalogueDto)
  readonly lands: CatalogueDto[];
}
