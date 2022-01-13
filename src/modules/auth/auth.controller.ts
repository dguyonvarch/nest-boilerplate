import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReqUser } from 'src/common';

import type { User } from '../users/models';
import { AuthService } from './auth.service';
import {
  AuthOutputDto,
  LoginInputDto,
  RefreshInputDto,
  RegisterUserInputDto,
} from './dto';
import { JwtGuard } from './jwt.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({
    description: 'The user has been successfully registered.',
  })
  async register(@Body() newUser: RegisterUserInputDto): Promise<void> {
    return this.authService.register(newUser);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'The user has been successfully logged in.',
    type: AuthOutputDto,
  })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiBadRequestResponse({ type: BadRequestException })
  async login(@Body() loginRequestDto: LoginInputDto): Promise<AuthOutputDto> {
    return this.authService.login(loginRequestDto);
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  @ApiOkResponse({
    description: 'The user has been successfully logged out.',
  })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  @ApiBadRequestResponse({ type: BadRequestException })
  async logout(@ReqUser() user: User): Promise<void> {
    return this.authService.logout(user.id);
  }

  @Post('refresh')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Access and refresh tokens have been successfully refreshed.',
    type: AuthOutputDto,
  })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async refresh(
    @ReqUser() user: User,
    @Body() { refreshToken }: RefreshInputDto,
  ): Promise<AuthOutputDto> {
    return await this.authService.refreshToken(user.id, refreshToken);
  }
}
