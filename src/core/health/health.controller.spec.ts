import { HealthCheckService } from '@nestjs/terminus';
import type { ErrorLogger } from '@nestjs/terminus/dist/health-check/error-logger/error-logger.interface';
import { HealthCheckExecutor } from '@nestjs/terminus/dist/health-check/health-check-executor.service';
import { mock, MockProxy } from 'jest-mock-extended';

import { HealthController } from './health.controller';
import { PrismaHealthIndicator } from './prisma.health.indicator';

describe('HealhController', () => {
  let healthController: HealthController;
  let healthCheckService: HealthCheckService;
  let mockPrismaHealthIndicator: MockProxy<PrismaHealthIndicator>;

  beforeEach(async () => {
    healthCheckService = new HealthCheckService(
      new HealthCheckExecutor(),
      mock<ErrorLogger>(),
    );
    mockPrismaHealthIndicator = mock<PrismaHealthIndicator>();
    healthController = new HealthController(
      healthCheckService,
      mockPrismaHealthIndicator,
    );
  });

  it('should return the service status', async () => {
    await healthController.check();
    expect(mockPrismaHealthIndicator.isHealthy).toHaveBeenCalledWith('Prisma');
  });
});
