// User

import { Decimal } from "@prisma/client/runtime/library";
import { UserType } from "@prisma/client";

export const buyerUser = {
  id: "user_buyer_001",
  email: "buyer@example.com",
  name: "파는사람",
  password: "password1234",
  type: UserType.BUYER,
  point: 0,
  totalAmount: new Decimal(0),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const buyerUser2 = {
  id: "user_buyer_002",
  email: "buyer2@example.com",
  name: "파는사람1",
  password: "password1234",
  type: UserType.BUYER,
  point: 0,
  totalAmount: new Decimal(0),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const sellerUser = {
  id: "user_seller_001",
  email: "seller@example.com",
  name: "이순신",
  password: "password1234",
  type: UserType.SELLER,
  point: 0,
  totalAmount: new Decimal(0),
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const sellerUser2 = {
  id: "user_seller_002",
  email: "seller2@example.com",
  name: "유관순",
  password: "password1234",
  type: UserType.SELLER,
  point: 0,
  totalAmount: new Decimal(0),
  createdAt: new Date(),
  updatedAt: new Date(),
};
