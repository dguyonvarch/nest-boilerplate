import { DeepMockProxy, mock, mockDeep, MockProxy } from 'jest-mock-extended';

import { LoggerService, PrismaService } from '../../core';
import { UserInputDto } from './dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let mockLoggerService: MockProxy<LoggerService>;
  let mockPrismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    mockLoggerService = mock<LoggerService>();
    mockPrismaService = mockDeep<PrismaService>();
    usersService = new UsersService(mockLoggerService, mockPrismaService);
  });

  it('should create a user', async () => {
    const user: UserInputDto = {
      username: 'test',
      email: 'test@test.com',
      password: 'password',
    };
    await usersService.create(user);
    expect(mockLoggerService.debug).toBeCalledTimes(1);
    expect(mockPrismaService.user.create).toBeCalledWith({ data: user });
  });

  it('should refresh tokens', async () => {
    const id = 'test';
    const refreshToken = 'refreshToken';
    await usersService.updateRefreshToken(id, refreshToken);
    expect(mockLoggerService.debug).toBeCalledTimes(1);
    expect(mockPrismaService.user.update).toBeCalledWith({
      data: { refreshToken },
      where: { id },
    });
  });

  it('should find a user by email', async () => {
    const email = 'test@test@com';
    await usersService.findByEmail(email);
    expect(mockLoggerService.debug).toBeCalledTimes(1);
    expect(mockPrismaService.user.findUnique).toBeCalledWith({
      where: { email },
    });
  });

  it('should find a user by id', async () => {
    const id = 'test';
    await usersService.findById(id);
    expect(mockLoggerService.debug).toBeCalledTimes(1);
    expect(mockPrismaService.user.findUnique).toBeCalledWith({
      where: { id },
    });
  });
});
