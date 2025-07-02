import { UserType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  type: UserType;
  point: number;
  gradeId: string | null;
  grace?: string | null;
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
