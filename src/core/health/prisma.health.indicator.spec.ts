import { HealthCheckError } from '@nestjs/terminus';
import { mock, MockProxy } from 'jest-mock-extended';

import { PrismaService } from '../prisma';
import { PrismaHealthIndicator } from './prisma.health.indicator';

describe('PrismaHealthIndicator', () => {
  let prismaHealthIndicator: PrismaHealthIndicator;
  let mockPrismaService: MockProxy<PrismaService>;

  beforeEach(async () => {
    mockPrismaService = mock<PrismaService>();
    prismaHealthIndicator = new PrismaHealthIndicator(mockPrismaService);
  });

  it('should return a healthy indicator', async () => {
    const status = await prismaHealthIndicator.isHealthy('prisma');
    expect(status).toEqual({
      prisma: { status: 'up' },
    });
  });

  it('should throw an HealthCheckError', async () => {
    mockPrismaService.$queryRaw.mockRejectedValue('No connected');
    await expect(prismaHealthIndicator.isHealthy('Prisma')).rejects.toThrow(
      HealthCheckError,
    );
  });
});
