export class RefreshTokenMalformedException extends Error {
  constructor() {
    super('Refresh token malformed');
    Object.setPrototypeOf(this, RefreshTokenMalformedException.prototype);
  }
}
