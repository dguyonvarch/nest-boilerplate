import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';
import type { LevelWithSilent } from 'pino';

import { LoggerService } from '../logger';

const PRISMA_LOG_CONTEXT = 'PrismaService';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {
    super({
      log: [
        {
          level: 'query',
          emit: 'event',
        },
        {
          level: 'info',
          emit: 'event',
        },
        {
          level: 'warn',
          emit: 'event',
        },
        {
          level: 'error',
          emit: 'event',
        },
      ],
      datasources: {
        db: { url: configService.get('database.url') },
      },
    });

    this.$on<any>('query', (event: Prisma.QueryEvent) => {
      this.loggerService.debug(event, PRISMA_LOG_CONTEXT);
    });
    this.$on<any>('info', (event: Prisma.LogEvent) => {
      this.loggerService.log(event.message, PRISMA_LOG_CONTEXT);
    });
    this.$on<any>('warn', (event: Prisma.LogEvent) => {
      this.loggerService.warn(event.message, PRISMA_LOG_CONTEXT);
    });
    this.$on<any>('error', (event: Prisma.LogEvent) => {
      this.loggerService.error(event.message, PRISMA_LOG_CONTEXT);
    });
  }

  changeLogLevel(logLevel: LevelWithSilent) {
    this.loggerService.changeLogLevel(logLevel);
  }

  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
