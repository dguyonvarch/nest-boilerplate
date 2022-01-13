export interface AuthConfig {
  jwt: {
    issuer: string;
    audience: string;
    accessTokenSecret: string;
    accessTokenExpiresIn: number;
    refreshTokenSecret: string;
    refreshTokenExpiresIn: number;
  };
}

export default (): AuthConfig => ({
  jwt: {
    issuer: process.env.JWT_ISSUER || 'issuer',
    audience: process.env.JWT_AUDIENCE || 'audience',
    accessTokenSecret:
      process.env.JWT_ACCESSTOKEN_SECRET || 'access-token-secret',
    accessTokenExpiresIn:
      parseInt(process.env.JWT_ACCESSTOKEN_EXPIRESIN || '') || 60 * 60, // 1h
    refreshTokenSecret:
      process.env.JWT_REFRESHTOKEN_SECRET || 'refresh-token-secret',
    refreshTokenExpiresIn:
      parseInt(process.env.JWT_REFRESHTOKEN_EXPIRESIN || '') ||
      60 * 60 * 24 * 10, // 10j
  },
});
