import { mockDeep, MockProxy } from 'jest-mock-extended';
import { PinoLogger } from 'nestjs-pino';

import { LoggerService } from '..';

describe('LoggerService', () => {
  let loggerService: LoggerService;

  beforeEach(async () => {
    const mockPinoLogger: MockProxy<PinoLogger> = mockDeep<PinoLogger>();
    // @ts-expect-error: root is readonly field, but this is the place where
    PinoLogger.root = mockPinoLogger.logger;
    PinoLogger.root.level = 'info';
    loggerService = new LoggerService(mockPinoLogger, {});
  });

  it('should change the log level', async () => {
    expect(PinoLogger.root.level).toBe('info');
    await loggerService.changeLogLevel('trace');
    expect(PinoLogger.root.level).toBe('trace');
  });
});
