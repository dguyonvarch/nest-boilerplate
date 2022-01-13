export class WrongPasswordLoginException extends Error {
  constructor(username: string) {
    super(`Wrong password for user ${username}`);
    Object.setPrototypeOf(this, WrongPasswordLoginException.prototype);
  }
}
