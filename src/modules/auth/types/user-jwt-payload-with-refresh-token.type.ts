import { UserJwtPayload } from './user-jwt-payload.type';

export type UserJwtPayloadWithRefreshToken = UserJwtPayload & {
  refreshToken: string;
};
