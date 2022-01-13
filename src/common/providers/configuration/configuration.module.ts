import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import {
  appConfig,
  authConfig,
  databaseConfig,
  logger,
} from '../../../configuration';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig, authConfig, logger],
    }),
  ],
})
export class ConfigurationModule {}
