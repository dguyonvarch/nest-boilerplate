import { Module } from '@nestjs/common';

import { ConfigurationModule } from './configuration';
import { HealthModule } from './health';
import { PrismaModule } from './prisma';

@Module({
  imports: [ConfigurationModule, PrismaModule, HealthModule],
})
export class CoreModule {}
