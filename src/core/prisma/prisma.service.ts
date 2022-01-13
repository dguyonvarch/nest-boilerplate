import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';

import { DbConfig } from '../../config';
import { LoggerService } from '../logger';

const PRISMA_LOG_CONTEXT = 'PrismaService';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly configService: ConfigService<DbConfig>,
    private readonly loggerService: LoggerService,
  ) {
    super({
      log: [
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
        db: { url: configService.get<DbConfig>('url', { infer: true }) },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.$on<any>('info', (event: Prisma.LogEvent) => {
      this.loggerService.log(event.message, PRISMA_LOG_CONTEXT);
    });
    this.$on<any>('warn', (event: Prisma.LogEvent) => {
      this.loggerService.warn(event.message, PRISMA_LOG_CONTEXT);
    });
    this.$on<any>('error', (event: Prisma.LogEvent) => {
      this.loggerService.error(event.message, PRISMA_LOG_CONTEXT);
    });

    this.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();
      this.loggerService.verbose(
        {
          model: params.model,
          action: params.action,
          args: params.args,
          duration: after - before,
        },
        'Executing Prisma query',
        PRISMA_LOG_CONTEXT,
      );

      return result;
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
