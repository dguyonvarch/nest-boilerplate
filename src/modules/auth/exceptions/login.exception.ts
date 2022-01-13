export class LoginException extends Error {
  constructor(userId: string) {
    super(`Login failed for user: ${userId}`);
    Object.setPrototypeOf(this, LoginException.prototype);
  }
}
