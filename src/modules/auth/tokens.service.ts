import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';

import { AuthConfig } from '../../config';
import { LoggerService } from '../../core';
import type { UserModel } from '../users/models/user.model';
import type { AuthOutputDto } from './dto';
import type { UserJwtPayload } from './types';

@Injectable()
export class TokensService {
  public constructor(
    private readonly configService: ConfigService<AuthConfig, true>,
    private readonly jwtService: JwtService,
    private readonly loggerService: LoggerService,
  ) {}

  public async generateTokens(payload: UserJwtPayload): Promise<AuthOutputDto> {
    return {
      accessToken: await this.generateAccessToken(payload),
      refreshToken: await this.generateRefreshToken(payload),
    };
  }

  public generatePayloadFromUser(user: UserModel): UserJwtPayload {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  validateRefreshToken(
    refreshToken: string,
    hashedrefreshToken: string,
  ): Promise<boolean> {
    return verify(refreshToken, hashedrefreshToken);
  }

  hashRefreshToken(refreshToken: string): Promise<string> {
    return hash(refreshToken);
  }

  private async generateAccessToken(payload: UserJwtPayload): Promise<string> {
    this.loggerService.debug(
      { args: { payload } },
      'Generating access token',
      TokensService.name,
    );
    return this.jwtService.signAsync(payload, {
      subject: payload.id,
      expiresIn: this.configService.get('jwt', { infer: true })
        .accessTokenExpiresIn,
      secret: this.configService.get('jwt', { infer: true }).accessTokenSecret,
    });
  }

  private async generateRefreshToken(payload: UserJwtPayload): Promise<string> {
    this.loggerService.debug(
      { args: { payload } },
      'Generating refresh token',
      TokensService.name,
    );
    return this.jwtService.signAsync(payload, {
      subject: payload.id,
      expiresIn: this.configService.get('jwt', { infer: true })
        .refreshTokenExpiresIn,
      secret: this.configService.get('jwt', { infer: true }).refreshTokenSecret,
    });
  }
}
