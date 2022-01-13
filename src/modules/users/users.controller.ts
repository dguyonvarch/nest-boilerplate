import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { JwtGuard } from 'src/modules/auth/jwt.guard';

import { UserOutputDto } from './dto';
import { UserModel } from './models/user.model';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The user informations have been successfully retrieived',
    type: UserOutputDto,
  })
  async me(@ReqUser() user: UserModel): Promise<UserOutputDto> {
    const me = await this.usersService.findById(user.id);
    return plainToInstance(UserOutputDto, me, {
      excludeExtraneousValues: true,
    });
  }
}
