import { Module } from '@nestjs/common';

import { LoggerModule, PrismaModule } from '../../core';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [LoggerModule, PrismaModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
