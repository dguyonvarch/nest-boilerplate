import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';

import { LoggerModule, PrismaModule, PrismaService } from '../../core';
import { UserInputDto } from './dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('Users module integration', () => {
  let usersController: UsersController;
  let userId: string;
  let userRole: Role;
  let userCreatedAt, userModifiedAt: Date;
  let userDto: UserInputDto;

  beforeAll(async () => {
    const userModule: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, LoggerModule],
      providers: [UsersService],
      controllers: [UsersController],
    }).compile();

    usersController = userModule.get<UsersController>(UsersController);
    const usersService = userModule.get<UsersService>(UsersService);
    const prismaService = userModule.get<PrismaService>(PrismaService);

    await prismaService.user.deleteMany();
    userDto = {
      username: 'test',
      email: 'test@test.com',
      password: '12345678',
    };
    ({
      id: userId,
      role: userRole,
      createdAt: userCreatedAt,
      modifiedAt: userModifiedAt,
    } = await usersService.create(userDto));
  });

  it('should get the user', async () => {
    const user = await usersController.me(userId);
    expect(user.id).toBe(userId);
    expect(user.username).toBe(userDto.username);
    expect(user.email).toBe(userDto.email);
    expect(user.role).toBe(userRole);
    expect(user.createdAt).toStrictEqual(userCreatedAt);
    expect(user.modifiedAt).toStrictEqual(userModifiedAt);
  });
});
