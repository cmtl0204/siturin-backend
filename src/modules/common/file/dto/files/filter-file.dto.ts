import { IsNotEmpty } from 'class-validator';
import { PaginationDto } from '@shared/dto';
import { isNotEmptyValidationOptions } from '@shared/dto-validation';

export class FilterFileDto extends PaginationDto {}
