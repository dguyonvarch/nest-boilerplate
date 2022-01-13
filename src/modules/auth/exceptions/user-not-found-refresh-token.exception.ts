export class UserNotFoundRefreshTokenException extends Error {
  constructor(userId: string, hashedRefreshToken: string) {
    super(
      `User not found with id: ${userId} and hashedRefreshToken: ${hashedRefreshToken}`,
    );
    Object.setPrototypeOf(this, UserNotFoundRefreshTokenException.prototype);
  }
}
