export class RefreshTokenExpiredException extends Error {
  constructor() {
    super('Refresh token expired');
    Object.setPrototypeOf(this, RefreshTokenExpiredException.prototype);
  }
}
