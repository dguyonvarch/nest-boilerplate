import { registerAs } from '@nestjs/config';

export default registerAs('logger', (): any => ({
  level:
    process.env.LOG_LEVEL || process.env.NODE_ENV !== 'production'
      ? 'debug'
      : 'error',
}));
