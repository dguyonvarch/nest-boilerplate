import { Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';

@Injectable()
export class PasswordService {
  validate(password: string, hashedPassword: string): Promise<boolean> {
    return verify(password, hashedPassword);
  }

  hash(password: string): Promise<string> {
    return hash(password);
  }
}
