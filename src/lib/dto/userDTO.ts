import { UserType } from "@prisma/client";

// Request DTO
export type CreateUserDTO = {
  name: string;
  email: string;
  password: string;
  image?: string | null;
  type: UserType;
};
