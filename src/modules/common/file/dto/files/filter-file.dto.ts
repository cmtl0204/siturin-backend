import { IsNotEmpty } from 'class-validator';
import { PaginationDto } from '../../../../../utils/dto';
import { isNotEmptyValidationOptions } from '../../../../../utils/dto-validation';

export class FilterFileDto extends PaginationDto {}
