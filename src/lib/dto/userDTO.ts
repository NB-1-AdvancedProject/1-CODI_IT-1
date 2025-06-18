import { UserType } from "@prisma/client";
import { User } from "../../types/user";
import { Decimal } from "@prisma/client/runtime/library";

// Request DTO
export type CreateUserDTO = {
  name: string;
  email: string;
  password: string;
  image?: string | null;
  type: UserType;
};

//Response DTO
export class UserResDTO {
  id: string;
  name: string;
  email: string;
  type: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
  grade: {
    name: string;
    id: string;
    rate: number;
    minAmount: Decimal;
  } | null;
  image: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.type = user.type;
    this.points = user.point;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.grade = user.grade
      ? {
          name: user.grade?.name,
          id: user.grade?.id,
          rate: user.grade?.pointRate,
          minAmount: user.grade?.minAmount,
        }
      : null;
    this.image = user.image ?? "";
  }
}
