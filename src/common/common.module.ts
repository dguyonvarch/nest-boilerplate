import { Module } from '@nestjs/common';

import { ConfigurationModule } from './providers/configuration';
import { HealthModule } from './providers/health';
import { LoggerModule } from './providers/logger';
import { PrismaModule } from './providers/prisma';

@Module({
  imports: [ConfigurationModule, PrismaModule, LoggerModule, HealthModule],
})
export class CommonModule {}
