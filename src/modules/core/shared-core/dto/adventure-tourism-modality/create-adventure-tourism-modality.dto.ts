import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CatalogueDto } from '@modules/common/catalogue/dto';

export class CreateAdventureTourismModalityDto {
  @IsNotEmpty()
  // @ValidateNested()
  @Type(() => CatalogueDto)
  readonly type: CatalogueDto;

  @IsString()
  readonly className: string;
}
