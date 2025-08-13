import { PartialType } from '@nestjs/swagger';
import { BaseActivityDto } from '@modules/core/shared-core/dto/activity/base-activity.dto';

export class UpdateActivityDto extends PartialType(BaseActivityDto) {}
