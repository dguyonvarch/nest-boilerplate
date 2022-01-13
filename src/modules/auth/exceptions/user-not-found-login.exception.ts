export class UserNotFoundLoginException extends Error {
  constructor(value: string) {
    super(`User not found with login: ${value}`);
    Object.setPrototypeOf(this, UserNotFoundLoginException.prototype);
  }
}
