export class RefreshTokenException extends Error {
  constructor(userId: string) {
    super(`Refresh token failed for user ${userId}`);
    Object.setPrototypeOf(this, RefreshTokenException.prototype);
  }
}
