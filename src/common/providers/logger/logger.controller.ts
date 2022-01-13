import { Body, Controller, HttpStatus, Put } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ChangeLogLevelDto } from './change-log-level.dto';
import { LoggerService } from './logger.service';

@ApiTags('Admin')
@Controller('admin')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Put('change-log-level')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'The current log level has been successfully changed',
  })
  changeLogLevel(@Body() { logLevel }: ChangeLogLevelDto): Promise<void> {
    this.loggerService.changeLogLevel(logLevel);
    return;
  }
}
