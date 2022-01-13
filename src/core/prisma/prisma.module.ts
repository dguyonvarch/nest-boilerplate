import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LoggerModule } from '../logger';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
