import { mock, MockProxy } from 'jest-mock-extended';

import { LoggerController, LoggerService } from '..';

describe('LoggerController', () => {
  let loggerController: LoggerController;
  let loggerService: MockProxy<LoggerService>;

  beforeEach(async () => {
    loggerService = mock(loggerService);
    loggerController = new LoggerController(loggerService);
  });

  it('should change the log level', async () => {
    await loggerController.changeLogLevel({ logLevel: 'trace' });
    expect(loggerService.changeLogLevel.calledWith('trace'));
  });
});
