import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import { PrismaHealthIndicator } from './prisma.health.indicator';

@ApiTags('Admin')
@Controller('admin')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealthIndicator: PrismaHealthIndicator,
  ) {}

  @ApiOkResponse({
    description: 'The service health has been successfully retrieved',
  })
  @Get('health')
  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.prismaHealthIndicator.isHealthy('Prisma'),
    ]);
  }
}
