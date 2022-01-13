import { Role } from '@prisma/client';

export class UserInputDto {
  username: string;
  email: string;
  password: string;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
  role?: Role;
}
