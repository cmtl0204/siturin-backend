import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as Bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { add, isBefore } from 'date-fns';
import { TransactionalCodeEntity, UserEntity } from '@auth/entities';
import { PayloadTokenInterface } from 'src/modules/auth/interfaces';
import {
  AuthRepositoryEnum,
  CoreRepositoryEnum,
  MailSubjectEnum,
  MailTemplateEnum,
} from '../../../utils/enums';
import {
  PasswordChangeDto,
  SignInDto,
  SignUpExternalDto,
  UpdateProfileDto,
  UpdateUserInformationDto,
} from '@auth/dto';
import { ServiceResponseHttpInterface } from '../../../utils/interfaces';
import { MailService } from '@modules/common/mail/mail.service';
import { config } from '@config';
import { ConfigType } from '@nestjs/config';
import { MailDataInterface } from '@modules/common/mail/interfaces/mail-data.interface';
import { UsersService } from './users.service';
import { PaymentEntity, RucEntity } from '@modules/core/entities';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  private readonly MAX_ATTEMPTS = 3;

  constructor(
    @Inject(AuthRepositoryEnum.USER_REPOSITORY)
    private repository: Repository<UserEntity>,
    @Inject(AuthRepositoryEnum.TRANSACTIONAL_CODE_REPOSITORY)
    private transactionalCodeRepository: Repository<TransactionalCodeEntity>,
    @Inject(CoreRepositoryEnum.RUC_REPOSITORY)
    private rucRepository: Repository<RucEntity>,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly httpService: HttpService,
  ) {}

  async changePassword(
    id: string,
    payload: PasswordChangeDto,
  ): Promise<ServiceResponseHttpInterface> {
    const user = await this.repository.findOne({
      select: {
        id: true,
        identification: true,
        lastname: true,
        name: true,
        maxAttempts: true,
        password: true,
        suspendedAt: true,
        username: true,
      },
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado para cambio de contraseña');
    }

    const isMatchPassword = await this.checkPassword(payload.passwordOld, user, false);

    if (!isMatchPassword) {
      throw new BadRequestException('La contraseña anterior no coincide.');
    }

    if (payload.passwordConfirmation !== payload.passwordNew) {
      throw new BadRequestException('Las contraseñas no coinciden.');
    }

    await this.repository.update(user.id, {
      password: Bcrypt.hashSync(payload.passwordNew, 10),
    });

    return { data: true };
  }

  async signIn(payload: SignInDto): Promise<ServiceResponseHttpInterface> {
    const user: UserEntity | null = await this.repository.findOne({
      select: {
        id: true,
        identification: true,
        lastname: true,
        name: true,
        maxAttempts: true,
        password: true,
        suspendedAt: true,
        username: true,
      },
      where: {
        username: payload.username,
      },
      relations: {
        roles: true,
        payment: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException({
        error: 'Sin Autorización',
        message: 'Usuario y/o contraseña no válidos',
      });
    }

    if (user?.suspendedAt)
      throw new UnauthorizedException({
        error: 'Cuenta Suspendida',
        message: 'Su usuario se encuentra suspendido',
      });

    if (payload.username.includes('@turismo.gob.ec')) {
      if (!(await this.signInLDAP(payload)))
        throw new UnauthorizedException({
          error: 'Sin Autorización',
          message: 'Usuario y/o contraseña no válidos',
        });
    }

    if (!payload.username.includes('@turismo.gob.ec')) {
      if (user?.payment?.hasDebt)
        throw new UnauthorizedException({
          error: 'El RUC ingresado mantiene pendiente el pago',
          message:
            'De la Contribución Uno por Mil sobre Activos Fijos, cobrados por esta Cartera de Estado, dentro del periodo de vigencia de la Ley de Turismo de Registro Oficial Suplemento No. 733 de 27 de Diciembre 2002, por favor sírvase asistir a la oficina zonal en la que se encuentra registrado su establecimiento para el trámite de revisión y declaración respectiva.',
        });

      if (user?.maxAttempts === 0)
        throw new UnauthorizedException({
          error: 'Sin Autorización',
          message: 'Ha excedido el número máximo de intentos permitidos',
        });

      if (!(await this.checkPassword(payload.password, user))) {
        throw new UnauthorizedException(
          `Usuario y/o contraseña no válidos, ${user.maxAttempts - 1} intentos restantes`,
        );
      }
    }
    const { password, suspendedAt, maxAttempts, roles, ...userRest } = user;

    await this.repository.update(user.id, { activatedAt: new Date() });

    return {
      data: {
        accessToken: await this.generateJwt(user),
        auth: userRest,
        roles,
      },
    };
  }

  async signInLDAP(payload: SignInDto): Promise<boolean> {
    const url = `${this.configService.urlLDAP}/${payload.username.split('@')[0]}/${payload.password}`;

    const response = await lastValueFrom(this.httpService.get(url));
    console.log(response.data);
    return response.data.data;
  }

  async signUpExternal(payload: SignUpExternalDto): Promise<ServiceResponseHttpInterface> {
    const user = this.repository.create();

    user.identification = payload.identification;
    user.email = payload.email;
    user.username = payload.email;
    user.name = payload.name;
    user.password = payload.password;
    user.passwordChanged = true;

    const userCreated = await this.repository.save(user);

    return { data: userCreated };
  }

  async findProfile(id: string): Promise<ServiceResponseHttpInterface> {
    const user = await this.repository.findOne({
      select: {
        id: true,
        identification: true,
        lastname: true,
        name: true,
        maxAttempts: true,
        password: true,
        suspendedAt: true,
        username: true,
      },
      where: {
        id,
      },
      relations: {
        roles: true,
        identificationType: true,
      },
    });

    if (!user) {
      throw new NotFoundException('El perfil no existe');
    }

    return {
      data: {
        user: user,
      },
    };
  }

  async findUserInformation(id: string): Promise<ServiceResponseHttpInterface> {
    const user = await this.repository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Información de usuario no existe');
    }

    return { data: user };
  }

  async updateUserInformation(
    id: string,
    payload: UpdateUserInformationDto,
  ): Promise<ServiceResponseHttpInterface> {
    const user = await this.userService.findOne(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado para actualizar información');
    }

    this.repository.merge(user, payload);
    const userUpdated = await this.repository.save(user);

    return { data: userUpdated };
  }

  async updateProfile(
    id: string,
    payload: UpdateProfileDto,
  ): Promise<ServiceResponseHttpInterface> {
    const user = await this.repository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado para actualizar el perfil');
    }

    const profileUpdated = await this.repository.update(id, payload);

    return { data: profileUpdated };
  }

  async refreshToken(user: UserEntity): Promise<ServiceResponseHttpInterface> {
    const accessToken = await this.generateJwt(user);

    return { data: { accessToken, user } };
  }

  async requestTransactionalCode(username: string): Promise<ServiceResponseHttpInterface> {
    const user = await this.repository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException({
        error: 'Usuario no encontrado para generar código transaccional',
        message: 'Intente de nuevo',
      });
    }
    const randomNumber = Math.random();
    const token = randomNumber.toString().substring(2, 8);

    const mailData: MailDataInterface = {
      to: user.email || user.personalEmail,
      subject: MailSubjectEnum.RESET_PASSWORD,
      template: MailTemplateEnum.TRANSACTIONAL_CODE,
      data: {
        token,
        user,
      },
    };

    await this.mailService.sendMail(mailData);

    const payload = { username: user.username, token, type: 'password_reset' };

    await this.transactionalCodeRepository.save(payload);

    const value = user.email || user.personalEmail;
    const chars = 3; // Cantidad de caracters visibles

    const email = value.replace(
      /[a-z0-9\-_.]+@/gi,
      (c) =>
        c.substr(0, chars) +
        c
          .split('')
          .slice(chars, -1)
          .map((v) => '*')
          .join('') +
        '@',
    );

    return { data: email };
  }

  async verifyTransactionalCode(
    token: string,
    username: string,
  ): Promise<ServiceResponseHttpInterface> {
    const transactionalCode = await this.transactionalCodeRepository.findOne({
      where: { token },
    });

    if (!transactionalCode) {
      throw new BadRequestException({
        message: 'Código Transaccional no válido',
        error: 'Error',
      });
    }

    if (transactionalCode.username !== username) {
      throw new BadRequestException({
        message: 'El usuario no corresponde al código transaccional generado',
        error: 'Error',
      });
    }

    if (transactionalCode.isUsed) {
      throw new BadRequestException({
        message: 'El código ya fue usado',
        error: 'Error',
      });
    }

    const maxDate = add(transactionalCode.createdAt, { minutes: 10 });

    if (isBefore(maxDate, new Date())) {
      throw new BadRequestException({
        message: 'El código ha expirado',
        error: 'Error',
      });
    }

    transactionalCode.isUsed = true;

    await this.transactionalCodeRepository.save(transactionalCode);

    return { data: true };
  }

  async resetPassword(payload: any): Promise<ServiceResponseHttpInterface> {
    const user = await this.repository.findOne({
      where: { username: payload.username },
    });

    if (!user) {
      throw new NotFoundException({
        message: 'Intente de nuevo',
        error: 'Usuario no encontrado para resetear contraseña',
      });
    }

    // user.maxAttempts = this.MAX_ATTEMPTS;
    // user.password = payload.passwordNew;
    // user.passwordChanged = true;

    await this.repository.update(user.id, {
      maxAttempts: this.MAX_ATTEMPTS,
      password: Bcrypt.hashSync(payload.passwordNew, 10),
      passwordChanged: true,
    });

    return { data: true };
  }

  async uploadAvatar(file: Express.Multer.File, id: string): Promise<ServiceResponseHttpInterface> {
    const entity = await this.repository.findOne({
      select: {
        id: true,
        avatar: true,
      },
      where: { id: id },
    });

    if (entity?.avatar) entity.avatar = `avatars/${file.filename}`;

    const user = await this.repository.save({ ...entity });

    return { data: user };
  }

  private async generateJwt(user: UserEntity): Promise<string> {
    const payload: PayloadTokenInterface = {
      id: user.id,
      username: user.username,
    };

    return await this.jwtService.signAsync(payload);
  }

  private async findByUsername(username: string): Promise<UserEntity> {
    return (await this.repository.findOne({
      where: {
        username,
      },
    })) as UserEntity;
  }

  private async checkPassword(
    passwordCompare: string,
    user: UserEntity,
    reduceAttempts = true,
  ): Promise<boolean> {
    const { password, ...userRest } = user;
    const isMatch = Bcrypt.compareSync(passwordCompare, password);

    if (isMatch) {
      await this.repository.update(user.id, { maxAttempts: this.MAX_ATTEMPTS });
      return true;
    }

    if (reduceAttempts) {
      await this.repository.update(userRest.id, {
        maxAttempts: userRest.maxAttempts > 0 ? userRest.maxAttempts - 1 : 0,
      });
    }

    return false;
  }

  async verifyIdentification(identification: string): Promise<ServiceResponseHttpInterface> {
    const user = await this.repository.findOneBy({ identification });

    return { data: user };
  }

  async verifyRucPendingPayment(rucNumber: string): Promise<ServiceResponseHttpInterface> {
    const ruc = await this.rucRepository.findOne({
      relations: { payment: true },
      where: { number: rucNumber },
    });

    if (!ruc) {
      return { data: false };
    }

    if (!ruc.payment) {
      return { data: false };
    }

    return { data: ruc.payment?.hasDebt };
  }
}
