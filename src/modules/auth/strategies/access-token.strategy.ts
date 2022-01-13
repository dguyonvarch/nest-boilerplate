import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthConfig } from '../../../config';
import { UserJwtPayload } from '../types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token',
) {
  constructor(private readonly configService: ConfigService<AuthConfig, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwt', { infer: true }).accessTokenSecret,
    });
  }

  validate(payload: UserJwtPayload): UserJwtPayload {
    return payload;
  }
}
