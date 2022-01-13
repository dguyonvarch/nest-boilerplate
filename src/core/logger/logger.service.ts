import { Injectable } from '@nestjs/common';
import { Logger, PinoLogger } from 'nestjs-pino';

import type { LogLevelWithSilent } from './types';

@Injectable()
export class LoggerService extends Logger {
  changeLogLevel(logLevel: LogLevelWithSilent): void {
    PinoLogger.root.level = logLevel;
  }
  setContext(name: string) {
    this.logger.setContext(name);
  }
}
