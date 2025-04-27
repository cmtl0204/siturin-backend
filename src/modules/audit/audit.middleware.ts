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
      const jwtDecode = this.jwtService.decode(token[1]) as PayloadTokenInterface;

      auditNamespace.run(() => {
        setCurrentUser({ id: jwtDecode.id });
        next();
      });
      return;
    }

    next();
  }
}
