import * as argon2 from 'argon2';

import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let passwordService: PasswordService;

  beforeEach(async () => {
    passwordService = new PasswordService();
  });

  it('should hash password', async () => {
    const password = 'test';
    const spyHash = jest.spyOn(argon2, 'hash').mockResolvedValue('');
    await passwordService.hash(password);
    expect(spyHash).toBeCalledWith(password);
  });

  it('should validate password', async () => {
    const password = 'test';
    const hashedPassword = 'hashedPassword';
    const spyVerify = jest.spyOn(argon2, 'verify').mockResolvedValue(true);
    await passwordService.validate(password, hashedPassword);
    expect(spyVerify).toBeCalledWith(password, hashedPassword);
  });
});
