import { Injectable } from '@nestjs/common';
import { Logger, PinoLogger } from 'nestjs-pino';
import type { LevelWithSilent } from 'pino';

@Injectable()
export class LoggerService extends Logger {
  changeLogLevel(logLevel: LevelWithSilent): Promise<void> {
    PinoLogger.root.level = logLevel;
    return;
  }
}
