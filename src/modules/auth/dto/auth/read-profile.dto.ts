import { Exclude } from 'class-transformer';
import { UserDto } from '@auth/dto';
import { PickType } from '@nestjs/swagger';

@Exclude()
export class ReadProfileDto extends PickType(UserDto, [
  'bloodType',
  'ethnicOrigin',
  'identificationType',
  'gender',
  'maritalStatus',
  'sex',
]) {}
