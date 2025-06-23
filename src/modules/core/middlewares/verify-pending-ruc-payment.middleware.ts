import { ForbiddenException, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from '@auth/entities';
import { PayloadTokenInterface } from 'src/modules/auth/interfaces';
import { AuthRepositoryEnum } from '../../../utils/enums';

@Injectable()
export class VerifyPendingRucPaymentMiddleware implements NestMiddleware {
  constructor(
    @Inject(AuthRepositoryEnum.USER_REPOSITORY)
    private readonly userEntityRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ');

      const jwtDecode: PayloadTokenInterface = this.jwtService.decode(token[1]);

      const user = await this.userEntityRepository.findOne({
        where: { id: jwtDecode.id },
        select: { id: true, suspendedAt: true },
      });

      if (user?.suspendedAt) {
        throw new ForbiddenException({
          error: 'Cuenta Suspendida',
          message: 'La cuenta del usuario está suspendida',
        });
      }
    }

    next();
  }
}
