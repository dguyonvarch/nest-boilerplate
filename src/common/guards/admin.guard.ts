import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Observable } from 'rxjs';

import { UserJwtPayload } from '../../modules/auth/types';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserJwtPayload;
    if (!user) throw new UnauthorizedException();
    return user.role === Role.ADMIN;
  }
}
