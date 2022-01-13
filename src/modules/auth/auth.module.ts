import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthConfig } from '../../config';
import { LoggerModule, PrismaModule } from '../../core';
import { ConfigurationModule } from '../../core/configuration';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { TokensService } from './tokens.service';

@Module({
  imports: [
    ConfigurationModule,
    LoggerModule,
    PrismaModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigurationModule],
      inject: [ConfigService],
      useFactory: (
        config: ConfigService<AuthConfig, true>,
      ): JwtModuleOptions => {
        return {
          signOptions: {
            issuer: config.get('jwt', { infer: true }).issuer,
            audience: config.get('jwt', { infer: true }).audience,
          },
        };
      },
    }),
  ],
  providers: [
    AuthService,
    PasswordService,
    TokensService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
