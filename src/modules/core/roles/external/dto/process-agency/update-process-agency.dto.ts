import { PartialType } from '@nestjs/swagger';
import { CreateProcessAgencyDto } from './create-process-agency.dto';

export class UpdateProcessAgencyDto extends PartialType(CreateProcessAgencyDto) {}
