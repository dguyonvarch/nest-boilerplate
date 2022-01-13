import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthConfig } from '../../../config';
import { UserJwtPayload, UserJwtPayloadWithRefreshToken } from '../types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly configService: ConfigService<AuthConfig, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwt', { infer: true }).refreshTokenSecret,
      passReqToCallback: true,
    });
  }

  validate(
    req: Request,
    payload: UserJwtPayload,
  ): UserJwtPayloadWithRefreshToken {
    const refreshToken = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
    return {
      ...payload,
      refreshToken,
    };
  }
}
