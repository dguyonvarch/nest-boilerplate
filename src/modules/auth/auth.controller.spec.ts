import { mock, MockProxy } from 'jest-mock-extended';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginInputDto, RegisterInputDto } from './dto';

describe('AuthController', () => {
  let authController: AuthController;
  let mockAuthService: MockProxy<AuthService>;

  beforeEach(async () => {
    mockAuthService = mock<AuthService>();
    authController = new AuthController(mockAuthService);
  });

  it('should register', async () => {
    const registerDto: RegisterInputDto = {
      email: 'test@test.com',
      password: 'password',
      username: 'test',
    };
    await authController.register(registerDto);
    expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
  });

  it('should login', async () => {
    const loginDto: LoginInputDto = {
      email: 'test@test.com',
      password: 'password',
    };
    await authController.login(loginDto);
    expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
  });

  it('should logout', async () => {
    await authController.logout('test');
    expect(mockAuthService.logout).toHaveBeenCalledWith('test');
  });

  it('should refresh tokens', async () => {
    await authController.refresh('123', 'refreshToken');
    expect(mockAuthService.refreshToken).toHaveBeenCalledWith(
      '123',
      'refreshToken',
    );
  });
});
