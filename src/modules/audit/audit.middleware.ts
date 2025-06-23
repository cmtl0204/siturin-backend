import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { auditNamespace, setCurrentUser } from '@modules/audit/audit-context';
import { PayloadTokenInterface } from 'src/modules/auth/interfaces';

@Injectable()
export class AuditMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ');

      if (token.length !== 2 || token[0] !== 'Bearer') {
        throw new Error('Formato de token inválido');
      }

      try {
        const jwtDecode: PayloadTokenInterface = this.jwtService.decode(token[1]);

        auditNamespace.run(() => {
          setCurrentUser({ id: jwtDecode.id });
          next();
        });
      } catch (error) {
        console.error(error);
        next();
      }

      return;
    }

    next();
  }
}
