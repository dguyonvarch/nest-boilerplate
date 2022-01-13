export class WrongEmailLoginException extends Error {
  constructor(username: string) {
    super(`Wrong email for user: ${username}`);
    Object.setPrototypeOf(this, WrongEmailLoginException.prototype);
  }
}
