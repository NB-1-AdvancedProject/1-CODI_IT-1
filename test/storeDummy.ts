// User

import { Decimal } from "@prisma/client/runtime/library";
import { UserType } from "@prisma/client";

export const buyerUser = {
  email: "buyer@example.com",
  name: "파는사람",
  password: "password1234",
  type: UserType.BUYER,
  point: 0,
  totalAmount: new Decimal(0),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const sellerUser = {
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
  email: "seller2@example.com",
  name: "유관순",
  password: "password1234",
  type: UserType.SELLER,
  point: 0,
  totalAmount: new Decimal(0),
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Store

export const store1 = {
  name: "마티네 마카롱",
  address: "서울특별시 종로구 종로1가 1-1",
  phoneNumber: "02-1111-2222",
  content: "프랑스 수제 마카롱 전문점 🥐",
  image: "https://example.com/images/store1.jpg",
  createdAt: new Date("2024-06-01T10:00:00Z"),
  updatedAt: new Date("2024-06-01T10:00:00Z"),
  deletedAt: null,
};
