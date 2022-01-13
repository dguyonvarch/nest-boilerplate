import type { LogLevelWithSilent } from '../core/logger/types';

export interface LoggerConfig {
  level: LogLevelWithSilent;
}

export default (): LoggerConfig => ({
  level:
    (process.env.LOG_LEVEL as LogLevelWithSilent) ||
    (process.env.NODE_ENV !== 'production' ? 'debug' : 'error'),
});
