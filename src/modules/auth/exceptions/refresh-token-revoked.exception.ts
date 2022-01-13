export class RefreshTokenRevokedException extends Error {
  constructor() {
    super('Refresh token revoked');
    Object.setPrototypeOf(this, RefreshTokenRevokedException.prototype);
  }
}
