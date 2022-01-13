import { mock, MockProxy, mockReset } from 'jest-mock-extended';

import { LoggerService } from '../../core';
import { UserInputDto } from '../users/dto';
import { UserModel } from '../users/models/user.model';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginInputDto, RegisterInputDto } from './dto';
import {
  EmailAlreadyExists,
  LoginException,
  RefreshTokenException,
  UserNotFoundLoginException,
  UserNotFoundRefreshTokenException,
} from './exceptions';
import { PasswordService } from './password.service';
import { TokensService } from './tokens.service';

const id = 'a1b2c3';
const email = 'test@test.com';
const password = 'password';
const username = 'test';
const accessToken = 'the-access-token';
const refreshToken = 'the-refresh-token';
const hashedPassword = 'the-hashed-password';
const hashedRefreshToken = 'the-hash-refresh-token';

const expectedUserJwtPayload = {
  id,
  isAdmin: false,
  email,
};

const expectedTokens = {
  accessToken,
  refreshToken,
};

describe('AuthService', () => {
  let authService: AuthService;
  let mockUsersService: MockProxy<UsersService>;
  let mockPasswordService: MockProxy<PasswordService>;
  let mockTokensService: MockProxy<TokensService>;
  let mockLoggerService: MockProxy<LoggerService>;

  beforeEach(async () => {
    mockUsersService = mock<UsersService>();
    mockPasswordService = mock<PasswordService>();
    mockTokensService = mock<TokensService>();
    mockLoggerService = mock<LoggerService>();
    authService = new AuthService(
      mockUsersService,
      mockPasswordService,
      mockTokensService,
      mockLoggerService,
    );
  });

  afterEach(() => {
    mockReset(mockUsersService);
    mockReset(mockPasswordService);
    mockReset(mockTokensService);
  });

  it('should logout', async () => {
    await authService.logout(id);
    expect(mockLoggerService.debug).toBeCalledTimes(1);
    expect(mockUsersService.updateRefreshToken).toBeCalledWith(id);
  });

  describe('register', () => {
    const registerDto: RegisterInputDto = {
      email,
      password,
      username,
    };

    const userInputDto: UserInputDto = {
      ...registerDto,
      password: hashedPassword,
    };

    it('should register', async () => {
      // Arrange
      const expectedCreatedUser: UserModel = {
        ...registerDto,
        id,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        isAdmin: false,
        refreshToken: null,
      };

      const expectedUserJwtPayload = {
        id: expectedCreatedUser.id,
        isAdmin: expectedCreatedUser.isAdmin,
        email: expectedCreatedUser.email,
      };

      mockUsersService.findByEmail
        .calledWith(registerDto.email)
        .mockResolvedValue(null);

      mockPasswordService.hash.mockResolvedValue(hashedPassword);

      mockUsersService.create.mockResolvedValue(expectedCreatedUser);

      mockTokensService.generatePayloadFromUser.mockReturnValue(
        expectedUserJwtPayload,
      );

      mockTokensService.generateTokens.mockResolvedValue(expectedTokens);

      mockTokensService.hashRefreshToken.mockResolvedValue(hashedRefreshToken);

      // Act
      const tokens = await authService.register(registerDto);

      // Assert
      expect(mockLoggerService.debug).toBeCalledTimes(1);
      expect(mockUsersService.findByEmail).toBeCalledWith(registerDto.email);
      expect(mockUsersService.create).toHaveBeenCalledWith(userInputDto);
      expect(mockTokensService.generatePayloadFromUser).toHaveBeenCalledWith(
        expectedCreatedUser,
      );
      expect(mockTokensService.generateTokens).toHaveBeenCalledWith(
        expectedUserJwtPayload,
      );
      expect(mockTokensService.hashRefreshToken).toHaveBeenCalledWith(
        refreshToken,
      );
      expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(
        expectedCreatedUser.id,
        hashedRefreshToken,
      );
      expect(tokens).toEqual(expectedTokens);
    });

    it('should throw EmailAlreadyExists', async () => {
      mockUsersService.findByEmail
        .calledWith(registerDto.email)
        .mockResolvedValue({ email: registerDto.email });

      await expect(authService.register(registerDto)).rejects.toThrow(
        EmailAlreadyExists,
      );
      expect(mockLoggerService.debug).toBeCalledTimes(1);
      expect(mockUsersService.findByEmail).toBeCalledWith(registerDto.email);
    });
  });

  describe('login', () => {
    const loginDto: LoginInputDto = {
      email,
      password,
    };

    it('should login', async () => {
      // Arrange
      const expectedUser: UserModel = {
        ...loginDto,
        id,
        username,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        isAdmin: false,
        refreshToken: null,
      };

      mockUsersService.findByEmail
        .calledWith(loginDto.email)
        .mockResolvedValue(expectedUser);
      mockPasswordService.validate.mockResolvedValue(true);

      mockTokensService.generatePayloadFromUser.mockReturnValue(
        expectedUserJwtPayload,
      );

      mockTokensService.generateTokens.mockResolvedValue(expectedTokens);

      mockTokensService.hashRefreshToken.mockResolvedValue(hashedRefreshToken);

      // Act
      const tokens = await authService.login(loginDto);

      // Assert
      expect(mockLoggerService.debug).toBeCalledTimes(1);
      expect(mockUsersService.findByEmail).toBeCalledWith(loginDto.email);
      expect(mockPasswordService.validate).toBeCalledWith(
        loginDto.password,
        hashedPassword,
      );
      expect(mockTokensService.generatePayloadFromUser).toHaveBeenCalledWith(
        expectedUser,
      );
      expect(mockTokensService.generateTokens).toHaveBeenCalledWith(
        expectedUserJwtPayload,
      );
      expect(mockTokensService.hashRefreshToken).toHaveBeenCalledWith(
        refreshToken,
      );
      expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(
        expectedUser.id,
        hashedRefreshToken,
      );
      expect(tokens).toEqual(expectedTokens);
    });

    it('should throw UserNotFoundLoginException', async () => {
      mockUsersService.findByEmail
        .calledWith(loginDto.email)
        .mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UserNotFoundLoginException,
      );
      expect(mockLoggerService.debug).toBeCalledTimes(1);
      expect(mockUsersService.findByEmail).toBeCalledWith(loginDto.email);
    });

    it('should throw LoginException', async () => {
      const expectedUser: UserModel = {
        ...loginDto,
        id,
        username,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        isAdmin: false,
        refreshToken: null,
      };
      mockUsersService.findByEmail
        .calledWith(loginDto.email)
        .mockResolvedValue(expectedUser);

      mockPasswordService.validate.mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(LoginException);
      expect(mockLoggerService.debug).toBeCalledTimes(1);
      expect(mockUsersService.findByEmail).toBeCalledWith(loginDto.email);
      expect(mockPasswordService.validate).toBeCalledWith(
        loginDto.password,
        hashedPassword,
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens', async () => {
      //Arrange
      const expectedUser: UserModel = {
        id,
        email,
        username,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        isAdmin: false,
        refreshToken: hashedRefreshToken,
      };

      mockUsersService.findById.mockResolvedValue(expectedUser);
      mockTokensService.validateRefreshToken.mockResolvedValue(true);
      mockTokensService.generateTokens.mockResolvedValue(expectedTokens);
      mockTokensService.hashRefreshToken.mockResolvedValue(hashedRefreshToken);

      // Act
      const tokens = await authService.refreshToken(id, refreshToken);

      // Assert
      expect(mockLoggerService.debug).toBeCalledTimes(1);
      expect(mockUsersService.findById).toBeCalledWith(id);
      expect(mockTokensService.validateRefreshToken).toBeCalledWith(
        refreshToken,
        hashedRefreshToken,
      );
      expect(mockTokensService.generateTokens).toHaveBeenCalledWith(
        expectedUserJwtPayload,
      );
      expect(mockTokensService.hashRefreshToken).toHaveBeenCalledWith(
        refreshToken,
      );
      expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(
        expectedUser.id,
        hashedRefreshToken,
      );
      expect(tokens).toEqual(expectedTokens);
    });

    it('should throw UserNotFoundRefreshTokenException', async () => {
      mockUsersService.findById.mockResolvedValue(null);

      await expect(authService.refreshToken(id, refreshToken)).rejects.toThrow(
        UserNotFoundRefreshTokenException,
      );
      expect(mockLoggerService.debug).toBeCalledTimes(1);
      expect(mockUsersService.findById).toBeCalledWith(id);
    });

    it('should throw RefreshTokenException', async () => {
      const expectedUser: UserModel = {
        id,
        email,
        username,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        isAdmin: false,
        refreshToken: hashedRefreshToken,
      };

      mockUsersService.findById.mockResolvedValue(expectedUser);
      mockTokensService.validateRefreshToken.mockResolvedValue(false);

      await expect(authService.refreshToken(id, refreshToken)).rejects.toThrow(
        RefreshTokenException,
      );
      expect(mockLoggerService.debug).toBeCalledTimes(1);
      expect(mockUsersService.findById).toBeCalledWith(id);
      expect(mockTokensService.validateRefreshToken).toBeCalledWith(
        refreshToken,
        hashedRefreshToken,
      );
    });
  });
});
