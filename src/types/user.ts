import { Grade, UserType } from "@prisma/client";

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  type: UserType;
  point: number;
  grade?: Grade | null;
  gradeId?: string | null;
  image?: string | null;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type Token = Omit<User, "password">;
export type TokenType = "access" | "refresh";
