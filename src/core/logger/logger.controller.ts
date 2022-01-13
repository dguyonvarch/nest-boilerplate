import { Body, Controller, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AdminGuard, AtGuard } from '../../common/guards';
import { ChangeLogLevelDto } from './change-log-level.dto';
import { LoggerService } from './logger.service';

@ApiTags('Admin')
@Controller('admin')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @UseGuards(AtGuard, AdminGuard)
  @Put('change-log-level')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'The current log level has been successfully changed',
  })
  changeLogLevel(@Body() { logLevel }: ChangeLogLevelDto): void {
    this.loggerService.changeLogLevel(logLevel);
  }
}
