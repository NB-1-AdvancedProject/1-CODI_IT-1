import { UserType } from "@prisma/client";
import { User } from "../../types/user";
import { Decimal } from "@prisma/client/runtime/library";
import { StoreResDTO } from "./storeDTO";

// Request DTO
export type CreateUserDTO = {
  name: string;
  email: string;
  password: string;
  image?: string | null;
  type: UserType;
};

export type UpdateUserDTO = {
  id: string;
  name?: string;
  password?: string;
  image?: string | null;
  currentPassword: string;
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

export class FavoriteResDTO {
  storeId: string;
  userId: string;
  store: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    address: string;
    phoneNumber: string;
    content: string;
    image: string;
  };

  constructor(userId: string, store: StoreResDTO) {
    this.storeId = store.id;
    this.userId = userId;
    this.store = {
      id: store.id,
      name: store.name,
      createdAt: store.createdAt,
      updatedAt: store.updatedAt,
      userId: store.userId,
      address: store.address,
      phoneNumber: store.phoneNumber,
      content: store.content,
      image: store.image,
    };
  }
}
