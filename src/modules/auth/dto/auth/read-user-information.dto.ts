import { UserDto } from '@auth/dto';
import { PickType } from '@nestjs/swagger';

export class ReadUserInformationDto extends PickType(UserDto, [
  'email',
  'emailVerifiedAt',
  'phone',
  'username',
]) {}
