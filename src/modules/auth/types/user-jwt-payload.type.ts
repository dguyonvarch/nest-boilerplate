import { Role } from '@prisma/client';

export type UserJwtPayload = {
  id: string;
  email: string;
  role: Role;
};
