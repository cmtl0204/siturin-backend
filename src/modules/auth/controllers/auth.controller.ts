import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth, PublicRoute, User } from '@auth/decorators';
import { UserEntity } from '@auth/entities';
import {
  PasswordChangeDto,
  SignInDto,
  SignUpExternalDto,
  UpdateProfileDto,
  UpdateUserInformationDto,
} from '@auth/dto';
import { ResponseHttpInterface } from '@utils/interfaces';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { getFileName, imageFilter } from '@utils/helpers';
import { AuthService } from '@auth/services/auth.service';

@Auth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'SignIn' })
  @PublicRoute()
  @Post('sign-in')
  @HttpCode(HttpStatus.CREATED)
  async signIn(@Body() payload: SignInDto): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.signIn(payload);

    return {
      data: serviceResponse.data,
      message: 'Acceso Correcto',
      title: 'Bienvenido/a',
    };
  }

  @ApiOperation({ summary: 'SignUpExternal' })
  @PublicRoute()
  @Post('sign-up-external')
  @HttpCode(HttpStatus.CREATED)
  async signUpExternal(@Body() payload: SignUpExternalDto): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.signUpExternal(payload);

    return {
      data: serviceResponse.data,
      message: 'Por favor inicie sesión',
      title: 'Usuario creado correctamente',
    };
  }

  @ApiOperation({ summary: 'Change Password' })
  @Put(':id/change-password')
  @HttpCode(HttpStatus.CREATED)
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: PasswordChangeDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.changePassword(id, payload);

    return {
      data: serviceResponse.data,
      message: 'La contraseña fue cambiada',
      title: 'Contraseña Actualizada',
    };
  }

  @ApiOperation({ summary: 'Find Profile' })
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async findProfile(@User() user: UserEntity): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.findProfile(user.id);

    return {
      data: serviceResponse.data,
      message: `profile`,
      title: `Success`,
    };
  }

  @ApiOperation({ summary: 'Find User Information' })
  @Get('user-information')
  @HttpCode(HttpStatus.OK)
  async findUserInformation(@User() user: UserEntity): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.findUserInformation(user.id);

    return {
      data: serviceResponse.data,
      message: 'La información del usuario fue actualizada',
      title: 'Atualizado',
    };
  }

  @ApiOperation({ summary: 'Update Profile' })
  @Put('profile')
  @HttpCode(HttpStatus.CREATED)
  async updateProfile(
    @User() user: UserEntity,
    @Body() payload: UpdateProfileDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.updateProfile(user.id, payload);

    return {
      data: serviceResponse.data,
      message: 'El perfil fue actualizado',
      title: 'Actualizado',
    };
  }

  @ApiOperation({ summary: 'Update User Information' })
  @Put('user-information')
  @HttpCode(HttpStatus.CREATED)
  async updateUserInformation(
    @User('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateUserInformationDto,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.updateUserInformation(id, payload);

    return {
      data: serviceResponse,
      message: 'La inforación del usuario fue actualizada',
      title: 'Actualuizado',
    };
  }

  @ApiOperation({ summary: 'Refresh Token' })
  @Auth()
  @Get('refresh-token')
  @HttpCode(HttpStatus.CREATED)
  async refreshToken(@User() user: UserEntity): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.refreshToken(user);

    return {
      data: serviceResponse.data,
      message: 'Correct Access',
      title: 'Refresh Token',
    };
  }

  @PublicRoute()
  @Get('transactional-codes/:username/request')
  @HttpCode(HttpStatus.OK)
  async requestTransactionalCode(
    @Param('username') username: string,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.requestTransactionalCode(username);

    return {
      data: serviceResponse.data,
      message: `Su código fue enviado a ${JSON.stringify(serviceResponse.data)}`,
      title: 'Código Enviado',
    };
  }

  @PublicRoute()
  @Patch('transactional-codes/:token/verify')
  @HttpCode(HttpStatus.OK)
  async verifyTransactionalCode(
    @Param('token') token: string,
    @Body('username') username: string,
  ): Promise<ResponseHttpInterface> {
    await this.authService.verifyTransactionalCode(token, username);

    return {
      data: null,
      message: `Por favor ingrese su nueva contraseña`,
      title: 'Código Válido',
    };
  }

  @PublicRoute()
  @Patch('reset-passwords')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() payload: any): Promise<ResponseHttpInterface> {
    await this.authService.resetPassword(payload);

    return {
      data: null,
      message: `Por favor inicie sesión`,
      title: 'Contraseña Reseteada',
    };
  }

  @ApiOperation({ summary: 'Upload Avatar' })
  @Post(':id/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: join(process.cwd(), 'public/assets/avatars'),
        filename: getFileName,
      }),
      fileFilter: imageFilter,
      limits: { fieldSize: 1 },
    }),
  )
  async uploadAvatar(
    @UploadedFile() avatar: Express.Multer.File,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseHttpInterface> {
    const response = await this.authService.uploadAvatar(avatar, id);

    return {
      data: response,
      message: 'Imagen Subida Correctamente',
      title: 'Imagen Subida',
    };
  }

  @PublicRoute()
  @Get('verify-identification/:identification')
  @HttpCode(HttpStatus.OK)
  async verifyIdentification(
    @Param('identification') identification: string,
  ): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.verifyIdentification(identification);

    return {
      data: serviceResponse.data,
      message: `Existe Identificacion`,
      title: 'Existe',
    };
  }

  @PublicRoute()
  @Get('verify-ruc-pending-payment/:ruc')
  @HttpCode(HttpStatus.OK)
  async verifyRucPendingPayment(@Param('ruc') ruc: string): Promise<ResponseHttpInterface> {
    const serviceResponse = await this.authService.verifyRucPendingPayment(ruc);

    return {
      data: serviceResponse.data,
      message: `Existe RUC`,
      title: 'Existe',
    };
  }
}
