import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserJwtPayloadWithRefreshToken } from '../../modules/auth/types';

export const ReqUser = createParamDecorator(
  (
    data: keyof UserJwtPayloadWithRefreshToken | undefined,
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
