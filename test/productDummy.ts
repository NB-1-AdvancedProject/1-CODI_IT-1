import { UserType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
export const sellerUser = {
  id: "seller1-id",
  email: "seller@example.com",
  name: "이순신",
  password: "password1234",
  type: UserType.SELLER,
  point: 0,
  totalAmount: new Decimal(0),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const buyerUser = {
  id: "buyer1-id",
  email: "buyer@example.com",
  name: "파는사람",
  password: "password1234",
  type: UserType.BUYER,
  point: 0,
  totalAmount: new Decimal(0),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const store1 = {
  id: "store1-id",
  name: "Store1",
  address: "address1",
  phoneNumber: "010-0000-0001",
  content: "StoreForProduct",
  user: {
    connect: { id: "seller1-id" },
  },
};

export const size1 = {
  id: "size1-id",
  size: "Free",
};

export const category1 = {
  id: "category1-id",
  name: "의류",
};

export const fullProduct = {
  id: "product1-id",
  name: "가디건",
  price: 100,
  image: "https://s3-url",
  content: "상품 상세 설명",
  category: {
    connect: { id: "category1-id" },
  },
  store: {
    connect: { id: "store1-id" },
  },
  stocks: {
    create: [
      {
        size: { connect: { id: "size1-id" } },
        quantity: 10,
      },
    ],
  },
};
