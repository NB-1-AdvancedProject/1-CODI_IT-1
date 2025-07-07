import { UserType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface User {
  id: string;
  email?: string | null;
  name: string;
  password?: string | null;
  type: UserType;
  point: number;
  gradeId: string | null;
  grade?: Grade | null;
  image?: string | null;
  totalAmount: Decimal;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface Grade {
  id: string;
  name: string;
  pointRate: number;
  minAmount: Decimal;
}
export type Token = Omit<User, "password">;
export type TokenType = "access" | "refresh";
