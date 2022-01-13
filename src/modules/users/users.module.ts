import { Module } from '@nestjs/common';
import { LoggerModule, PrismaModule } from 'src/common';

import { UserController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [LoggerModule, PrismaModule],
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
