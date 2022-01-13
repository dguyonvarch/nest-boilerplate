import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { LoggerService, PrismaService } from 'src/common';

import type { UserModel } from './models';

@Injectable()
export class UsersService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(newUser: Prisma.UserCreateInput): Promise<UserModel> {
    this.loggerService.debug(
      'create(%o)',
      { ...newUser, password: '****' },
      UsersService.name,
    );

    return await this.prismaService.user.create({
      data: newUser,
    });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    this.loggerService.debug(
      'updateRefreshToken(%o)',
      {
        userId,
        refreshToken,
      },
      UsersService.name,
    );

    await this.prismaService.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    this.loggerService.debug('findByEmail(%o)', { email }, UsersService.name);
    return this.prismaService.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<UserModel | null> {
    this.loggerService.debug('findById(%o)', { id }, UsersService.name);
    return this.prismaService.user.findUnique({ where: { id } });
  }
}
