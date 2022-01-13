import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { appConfig, authConfig, dbConfig, loggerConfig } from '../../config';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, dbConfig, authConfig, loggerConfig],
    }),
  ],
})
export class ConfigurationModule {}
