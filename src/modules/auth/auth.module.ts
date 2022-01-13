import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule, PrismaModule } from 'src/common';
import { ConfigurationModule } from 'src/common/providers/configuration/configuration.module';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
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
      useFactory: (config: ConfigService): JwtModuleOptions => {
        return {
          signOptions: {
            issuer: config.get('auth.jwt.issuer'),
            audience: config.get('auth.jwt.audience'),
          },
        };
      },
    }),
  ],
  providers: [AuthService, TokensService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
