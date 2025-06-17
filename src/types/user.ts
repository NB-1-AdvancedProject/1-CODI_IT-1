import { Grade, UserType } from "@prisma/client";

export interface User {
  id: string;
  email: string;
  password: string;
  type: UserType;
  point: Number;
  grade?: Grade | null;
  gradeId?: string | null;
  image?: string | null;
  totalAmount: Number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export type Token = {
  id: string;
  email: string;
  type: UserType;
  point: Number;
  grade?: Grade | null;
  gradeId?: string | null;
  image?: string | null;
  totalAmount: Number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type TokenType = "access" | "refresh";
