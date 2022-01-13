import { Injectable } from '@nestjs/common';

import { LoggerService } from '../../core';
import type { UserInputDto } from '../users/dto';
import type { UserModel } from '../users/models/user.model';
import { UsersService } from '../users/users.service';
import type { AuthOutputDto, LoginInputDto, RegisterInputDto } from './dto';
import {
  EmailAlreadyExists,
  LoginException,
  RefreshTokenException,
  UserNotFoundLoginException,
  UserNotFoundRefreshTokenException,
} from './exceptions';
import { PasswordService } from './password.service';
import { TokensService } from './tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly tokensService: TokensService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext('plip');
  }

  async register(registerInputDto: RegisterInputDto): Promise<AuthOutputDto> {
    this.loggerService.debug(
      { args: { ...registerInputDto, password: '****' } },
      'Registering',
      AuthService.name,
    );
    let user: UserModel = await this.usersService.findByEmail(
      registerInputDto.email,
    );
    if (user) {
      throw new EmailAlreadyExists(user.email);
    }

    const password = await this.passwordService.hash(registerInputDto.password);
    const newUser: UserInputDto = {
      ...registerInputDto,
      password,
    };

    user = await this.usersService.create(newUser);
    const payload = this.tokensService.generatePayloadFromUser(user);
    const tokens = await this.tokensService.generateTokens(payload);
    const hashedRefreshToken = await this.tokensService.hashRefreshToken(
      tokens.refreshToken,
    );
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);
    return tokens;
  }

  async login(loginRequestDto: LoginInputDto): Promise<AuthOutputDto> {
    this.loggerService.debug(
      { args: { ...loginRequestDto, password: '****' } },
      'Logging in',
      AuthService.name,
    );
    const email = loginRequestDto.email;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UserNotFoundLoginException(loginRequestDto.email);
    }
    const password = loginRequestDto.password;
    const isMatch = await this.passwordService.validate(
      password,
      user.password,
    );
    if (!isMatch) {
      throw new LoginException(user.id);
    }
    const payload = this.tokensService.generatePayloadFromUser(user);
    const tokens = await this.tokensService.generateTokens(payload);
    const hashedRefreshToken = await this.tokensService.hashRefreshToken(
      tokens.refreshToken,
    );
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    this.loggerService.debug(
      { args: { userId } },
      'Logging out',
      AuthService.name,
    );
    return this.usersService.updateRefreshToken(userId);
  }

  async refreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<AuthOutputDto> {
    this.loggerService.debug(
      { args: { userId, refreshToken } },
      'Refreshing token',
      AuthService.name,
    );
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UserNotFoundRefreshTokenException(userId, refreshToken);
    }

    const isRefreshTokenMatching =
      await this.tokensService.validateRefreshToken(
        refreshToken,
        user.refreshToken,
      );

    if (!isRefreshTokenMatching) {
      throw new RefreshTokenException(user.id);
    }

    const tokens = await this.tokensService.generateTokens({
      id: userId,
      email: user.email,
      role: user.role,
    });
    const hashedRefreshToken = await this.tokensService.hashRefreshToken(
      tokens.refreshToken,
    );
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);
    return tokens;
  }
}
