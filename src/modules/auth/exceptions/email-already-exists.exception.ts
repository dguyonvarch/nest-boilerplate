export class EmailAlreadyExists extends Error {
  constructor(email: string) {
    super(`Email already exists: ${email}`);
    Object.setPrototypeOf(this, EmailAlreadyExists.prototype);
  }
}
