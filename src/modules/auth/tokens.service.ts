import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { LoggerService } from 'src/common';

import type { AuthOutputDto } from './dto';
import {
  RefreshTokenExpiredException,
  RefreshTokenMalformedException,
} from './exceptions';
import type { JwtPayloadModel } from './models';

@Injectable()
export class TokensService {
  public constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly loggerService: LoggerService,
  ) {}

  public async generateTokens(
    payload: JwtPayloadModel,
  ): Promise<AuthOutputDto> {
    this.loggerService.debug(
      'generateTokens(%o)',
      {
        payload,
      },
      TokensService.name,
    );
    return {
      accessToken: await this.generateAccessToken(payload),
      refreshToken: await this.generateRefreshToken(payload),
    };
  }

  private async generateAccessToken(payload: JwtPayloadModel): Promise<string> {
    this.loggerService.debug(
      'generateAccessToken(%o)',
      {
        payload,
      },
      TokensService.name,
    );
    return this.jwtService.signAsync(payload, {
      subject: payload.id,
      expiresIn: this.configService.get('auth.jwt.accessTokenExpiresIn'),
      secret: this.configService.get('auth.jwt.accessTokenSecret'),
    });
  }

  private async generateRefreshToken(
    payload: JwtPayloadModel,
  ): Promise<string> {
    this.loggerService.debug(
      'generateRefreshToken(%o)',
      {
        payload,
      },
      TokensService.name,
    );
    return this.jwtService.signAsync(payload, {
      subject: payload.id,
      expiresIn: this.configService.get('auth.jwt.refreshTokenExpiresIn'),
      secret: this.configService.get('auth.jwt.refreshTokenSecret'),
    });
  }

  public async refreshToken(refreshToken: string): Promise<AuthOutputDto> {
    this.loggerService.debug(
      'refreshToken(%o)',
      {
        refreshToken,
      },
      TokensService.name,
    );
    const payload = await this.decodeRefreshToken(refreshToken);
    return this.generateTokens(payload);
  }

  public async decodeRefreshToken(token: string): Promise<JwtPayloadModel> {
    this.loggerService.debug(
      'decodeRefreshToken(%o)',
      {
        token,
      },
      TokensService.name,
    );
    try {
      return this.jwtService.verifyAsync(token, {
        secret: this.configService.get('auth.jwt.refreshTokenSecret'),
      });
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new RefreshTokenExpiredException();
      } else {
        throw new RefreshTokenMalformedException();
      }
    }
  }
}
