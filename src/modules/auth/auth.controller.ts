import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpErrorOutputDto } from 'src/common/dto';

import { ReqUser } from '../../common';
import { AtGuard, RtGuard } from '../../common/guards';
import { AuthService } from './auth.service';
import { AuthOutputDto, LoginInputDto, RegisterInputDto } from './dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({
    description: 'The user has been successfully registered.',
  })
  @ApiUnauthorizedResponse({ type: HttpErrorOutputDto })
  @ApiBadRequestResponse({ type: HttpErrorOutputDto })
  async register(@Body() newUser: RegisterInputDto): Promise<AuthOutputDto> {
    return this.authService.register(newUser);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'The user has been successfully logged in.',
    type: AuthOutputDto,
  })
  @ApiUnauthorizedResponse({ type: HttpErrorOutputDto })
  @ApiBadRequestResponse({ type: HttpErrorOutputDto })
  async login(@Body() loginRequestDto: LoginInputDto): Promise<AuthOutputDto> {
    return this.authService.login(loginRequestDto);
  }

  @Post('logout')
  @UseGuards(AtGuard)
  @HttpCode(200)
  @ApiOkResponse({
    description: 'The user has been successfully logged out.',
  })
  @ApiUnauthorizedResponse({ type: HttpErrorOutputDto })
  @ApiBadRequestResponse({ type: HttpErrorOutputDto })
  async logout(@ReqUser('id') userId: string): Promise<void> {
    return this.authService.logout(userId);
  }

  @Post('refresh')
  @UseGuards(RtGuard)
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Access and refresh tokens have been successfully refreshed.',
    type: AuthOutputDto,
  })
  @ApiUnauthorizedResponse({ type: HttpErrorOutputDto })
  @ApiBadRequestResponse({ type: HttpErrorOutputDto })
  async refresh(
    @ReqUser('id') userId: string,
    @ReqUser('refreshToken') refreshToken: string,
  ): Promise<AuthOutputDto> {
    return await this.authService.refreshToken(userId, refreshToken);
  }
}
