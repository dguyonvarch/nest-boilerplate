import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import type { LevelWithSilent } from 'pino';

const logLevelEnum = ['error', 'info', 'warn', 'debug', 'trace', 'silent'];
export class ChangeLogLevelDto {
  @ApiProperty({ enum: logLevelEnum })
  @IsEnum(logLevelEnum)
  logLevel: LevelWithSilent;
}
