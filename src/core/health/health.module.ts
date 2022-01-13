import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { LoggerModule } from '../logger';
import { PrismaModule } from '../prisma';
import { HealthController } from './health.controller';
import { PrismaHealthIndicator } from './prisma.health.indicator';

@Module({
  imports: [TerminusModule, PrismaModule, LoggerModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator],
})
export class HealthModule {}
