import { Role } from '@prisma/client';

export class UserModel {
  id: string;
  username: string;
  email: string;
  password: string;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
}
