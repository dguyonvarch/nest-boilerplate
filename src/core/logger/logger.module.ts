import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule, Params } from 'nestjs-pino';
import { v4 as uuidv4 } from 'uuid';

import { LoggerConfig } from '../../config';
import { ConfigurationModule } from '../configuration';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';

@Module({
  controllers: [LoggerController],
  providers: [LoggerService],
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<LoggerConfig>): Params => {
        return {
          pinoHttp: {
            level: config.get('level'),
            genReqId: (request) => (request.headers['x-request-id'] = uuidv4()),
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
