import { IsObject, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CatalogueDto } from '@modules/common/catalogue/dto';

export class CreateAdventureTourismModalityDto {
  @IsObject()
  // @ValidateNested()
  @Type(() => CatalogueDto)
  readonly type: CatalogueDto;

  @IsString()
  readonly className: string;
}
