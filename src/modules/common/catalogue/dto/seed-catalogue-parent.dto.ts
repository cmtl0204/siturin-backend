import { CatalogueDto } from './catalogue.dto';
import {  IsUUID } from 'class-validator';

export class SeedCatalogueParentDto extends CatalogueDto {
  @IsUUID()
  readonly parentId: string;
}
