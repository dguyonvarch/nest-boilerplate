import { registerAs } from '@nestjs/config';

export default registerAs('auth', (): any => ({
  jwt: {
    issuer: process.env.JWT_ISSUER || 'issuer',
    audience: process.env.JWT_AUDIENCE || 'audience',
    accessTokenSecret:
      process.env.JWT_ACCESSTOKEN_SECRET || 'access-token-secret',
    accessTokenExpiresIn:
      parseInt(process.env.JWT_ACCESSTOKEN_EXPIRESIN) || 60 * 5, // 5m
    refreshTokenSecret:
      process.env.JWT_REFRESHTOKEN_SECRET || 'refresh-token-secret',
    refreshTokenExpiresIn:
      parseInt(process.env.JWT_REFRESHTOKEN_EXPIRESIN) || 60 * 60 * 24 * 10, // 10j
  },
}));
