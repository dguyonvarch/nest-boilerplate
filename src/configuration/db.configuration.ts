import { registerAs } from '@nestjs/config';

export default registerAs('database', (): any => ({
  url: process.env.DATABASE_URL || 'file:./dev.db',
}));
