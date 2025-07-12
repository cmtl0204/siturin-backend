import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { isStringValidationOptions } from '@utils/dto-validation';
import { Type } from 'class-transformer';
import {
  EstablishmentAddressEntity,
  EstablishmentContactPersonEntity,
} from '@modules/core/entities';
import { CreateStep2EstablishmentDto } from '@modules/core/shared-core/dto/process/create-step2-establishment.dto';

export class CreateStep2Dto {
  @IsString(isStringValidationOptions())
  readonly processId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateStep2EstablishmentDto)
  readonly establishment: CreateStep2EstablishmentDto;

  @IsOptional()
  @Type(() => EstablishmentAddressEntity)
  readonly establishmentAddress: EstablishmentAddressEntity;

  @IsOptional()
  @Type(() => EstablishmentContactPersonEntity)
  readonly establishmentContactPerson: EstablishmentContactPersonEntity;
}
