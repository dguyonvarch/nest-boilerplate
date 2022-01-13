import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule, Params } from 'nestjs-pino';
import type { LevelWithSilent } from 'pino';

import { ConfigurationModule } from '../configuration/configuration.module';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';

@Module({
  controllers: [LoggerController],
  providers: [LoggerService],
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): Params => {
        return {
          pinoHttp: {
            level: config.get('logger.level') as LevelWithSilent,
            transport:
              process.env.NODE_ENV !== 'production'
                ? { target: 'pino-pretty' }
                : undefined,
          },
        };
      },
    }),
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
