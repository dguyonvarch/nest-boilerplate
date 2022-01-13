import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { DeepMockProxy, mock, mockDeep, MockProxy } from 'jest-mock-extended';

import { AuthConfig } from '../../config';
import { LoggerService } from '../../core/logger/logger.service';
import { UserModel } from '../users/models/user.model';
import { TokensService } from './tokens.service';
import { UserJwtPayload } from './types';

describe('TokensService', () => {
  let tokensService: TokensService;
  let mockConfigService: DeepMockProxy<ConfigService<AuthConfig, true>>;
  let mockJwtService: MockProxy<JwtService>;
  let mockLoggerService: MockProxy<LoggerService>;

  beforeEach(async () => {
    mockConfigService = mockDeep<ConfigService<AuthConfig, true>>();
    mockJwtService = mock<JwtService>();
    mockLoggerService = mock<LoggerService>();
    tokensService = new TokensService(
      mockConfigService,
      mockJwtService,
      mockLoggerService,
    );
  });

  it('should refresh tokens', async () => {
    const payload: UserJwtPayload = {
      email: 'test@test.com',
      id: 'test',
      role: 'USER',
    };

    const authConfig: AuthConfig = {
      jwt: {
        issuer: 'test-issuer',
        audience: 'test-audience',
        accessTokenSecret: 'test-access-token-secret',
        accessTokenExpiresIn: 10,
        refreshTokenSecret: 'test-refresh-token-secret',
        refreshTokenExpiresIn: 100,
      },
    };

    mockConfigService.get.mockReturnValue(authConfig.jwt);

    await tokensService.generateTokens(payload);
    expect(mockLoggerService.debug).toBeCalledTimes(2);
    expect(mockJwtService.signAsync).toBeCalledTimes(2);
    // accessToken
    expect(mockJwtService.signAsync).toBeCalledWith(payload, {
      subject: payload.id,
      expiresIn: authConfig.jwt.accessTokenExpiresIn,
      secret: authConfig.jwt.accessTokenSecret,
    });
    // refreshToken
    expect(mockJwtService.signAsync).toBeCalledWith(payload, {
      subject: payload.id,
      expiresIn: authConfig.jwt.refreshTokenExpiresIn,
      secret: authConfig.jwt.refreshTokenSecret,
    });
  });

  it('should generate the user jwt payload from a user type', () => {
    const user: UserModel = {
      id: 'test',
      username: 'test',
      email: 'test@test.com',
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
      password: 'password',
      refreshToken: 'refreshToken',
    };
    expect(tokensService.generatePayloadFromUser(user)).toEqual({
      email: 'test@test.com',
      id: 'test',
      isAdmin: false,
    });
  });

  it('should hash refreshToken', async () => {
    const refreshToken = 'test';
    const spyHash = jest.spyOn(argon2, 'hash').mockResolvedValue('');
    await tokensService.hashRefreshToken(refreshToken);
    expect(spyHash).toBeCalledWith(refreshToken);
  });

  it('should validate refreshToken', async () => {
    const refreshToken = 'test';
    const hashedPassword = 'hashedPassword';
    const spyVerify = jest.spyOn(argon2, 'verify').mockResolvedValue(true);
    await tokensService.validateRefreshToken(refreshToken, hashedPassword);
    expect(spyVerify).toBeCalledWith(refreshToken, hashedPassword);
  });
});
