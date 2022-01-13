import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import { LoggerService } from 'src/common';

import type { UserInputDto } from '../users/dto';
import type { User } from '../users/models';
import { UsersService } from '../users/users.service';
import type { AuthOutputDto, LoginInputDto, RegisterUserInputDto } from './dto';
import type { JwtPayloadModel } from './models/jwt-payload.model';
import { TokensService } from './tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly loggerService: LoggerService,
  ) {}

  async register(registerInputDto: RegisterUserInputDto): Promise<void> {
    this.loggerService.debug(
      'register(%o)',
      {
        ...registerInputDto,
        password: '****',
      },
      AuthService.name,
    );
    const user: User = await this.usersService.findByEmail(
      registerInputDto.email,
    );
    if (user) {
      throw new ConflictException('A user with this email already exists');
    }
    const salt = await genSalt();
    const password = await hash(registerInputDto.password, salt);
    const newUser: UserInputDto = {
      ...registerInputDto,
      salt,
      password,
    };

    await this.usersService.create(newUser);
  }

  async login(loginRequestDto: LoginInputDto): Promise<AuthOutputDto> {
    this.loggerService.debug(
      'login(%o)',
      {
        ...loginRequestDto,
        password: '****',
      },
      AuthService.name,
    );
    const email = loginRequestDto.email;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`No user found with email: ${email}`);
    }
    const password = loginRequestDto.password;
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload: JwtPayloadModel = { id: user.id };
    const tokens = await this.tokensService.generateTokens(payload);
    const hashedRefreshToken = await hash(tokens.refreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    this.loggerService.debug('logout(%o)', { userId }, AuthService.name);
    return this.usersService.updateRefreshToken(userId, null);
  }

  async refreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<AuthOutputDto> {
    this.loggerService.debug(
      'refreshToken(%o)',
      {
        userId,
        refreshToken,
      },
      AuthService.name,
    );
    const user = await this.usersService.findById(userId);
    const isRefreshTokenMatching = await compare(
      refreshToken,
      user.refreshToken,
    );

    if (isRefreshTokenMatching) {
      const tokens = await this.tokensService.generateTokens({ id: userId });
      const hashedRefreshToken = await hash(tokens.refreshToken, 10);
      await this.usersService.updateRefreshToken(userId, hashedRefreshToken);
      return tokens;
    } else {
      throw new UnauthorizedException();
    }
  }
}
