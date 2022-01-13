import { Injectable } from '@nestjs/common';

import { LoggerService, PrismaService } from '../../core';
import { UserInputDto } from './dto';
import type { UserModel } from './models';

@Injectable()
export class UsersService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(newUser: UserInputDto): Promise<UserModel> {
    this.loggerService.debug(
      { args: { ...newUser, password: '****' } },
      'Creating a user',
      UsersService.name,
    );

    return this.prismaService.user.create({
      data: newUser,
    });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken?: string,
  ): Promise<void> {
    this.loggerService.debug(
      { args: { userId, refreshToken } },
      'Updating user refreshToken',
      UsersService.name,
    );

    await this.prismaService.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    this.loggerService.debug(
      { args: { email } },
      'Finding user by email',
      UsersService.name,
    );
    const user: UserModel = await this.prismaService.user.findUnique({
      where: { email },
    });
    return user;
  }

  async findById(id: string): Promise<UserModel | null> {
    this.loggerService.debug(
      { args: { id } },
      'Finding user by id',
      UsersService.name,
    );
    const user: UserModel = await this.prismaService.user.findUnique({
      where: { id },
    });
    return user;
  }
}
