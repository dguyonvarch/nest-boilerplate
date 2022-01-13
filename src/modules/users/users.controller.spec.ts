import { mock, MockProxy } from 'jest-mock-extended';

import { UserModel } from './models/user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let mockUsersService: MockProxy<UsersService>;

  beforeEach(async () => {
    mockUsersService = mock<UsersService>();
    usersController = new UsersController(mockUsersService);
  });

  it('should return my user without sensitive properties', async () => {
    const user: UserModel = {
      id: 'a1b1c2',
      username: 'test',
      email: 'test@test.com',
      password: 'password',
      refreshToken: 'refreshToken',
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUsersService.findById.mockResolvedValue(user);

    const expectedUser = await usersController.me('a1b1c2');

    expect(expectedUser).not.toHaveProperty('salt');
    expect(expectedUser).not.toHaveProperty('password');
    expect(expectedUser).not.toHaveProperty('refreshToken');
    expect(expectedUser).not.toHaveProperty('password');
  });
});
