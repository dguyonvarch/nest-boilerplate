export class RefreshTokenNotFoundException extends Error {
  constructor() {
    super('Refresh token not found');
    Object.setPrototypeOf(this, RefreshTokenNotFoundException.prototype);
  }
}
