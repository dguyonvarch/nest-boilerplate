import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { ReqUser } from '../../common/decorators';
import { AtGuard } from '../../common/guards';
import { UserOutputDto } from './dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(AtGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The user informations have been successfully retrieived',
    type: UserOutputDto,
  })
  async me(@ReqUser('id') userId: string): Promise<UserOutputDto> {
    const me = await this.usersService.findById(userId);
    return plainToInstance(UserOutputDto, me, {
      excludeExtraneousValues: true,
    });
  }
}
