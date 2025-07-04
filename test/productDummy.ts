import { Prisma, UserType } from "@prisma/client";
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

export const seller2 = {
  id: "seller2-id",
  email: "seller2@example.com",
  password: "hashed-password2",
  name: "Seller Two",
  type: UserType.SELLER,
  point: 0,
  totalAmount: new Prisma.Decimal(0),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const seller3 = {
  id: "seller3-id",
  email: "seller3@example.com",
  password: "hashed-password3",
  name: "Seller Three",
  type: UserType.SELLER,
  point: 0,
  totalAmount: new Prisma.Decimal(0),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const store2 = {
  id: "store2-id",
  name: "Store2",
  address: "address2",
  phoneNumber: "010-0000-0002",
  content: "Store For Seller 2",
  user: {
    connect: { id: "seller2-id" },
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const store3 = {
  id: "store3-id",
  name: "Store3",
  address: "address3",
  phoneNumber: "010-0000-0003",
  content: "Store For Seller 3",
  user: {
    connect: { id: "seller3-id" },
  },
  createdAt: new Date(),
  updatedAt: new Date(),
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
  sales: 1,
  reviewsCount: 1,
  reviewsRating: 1,
  createdAt: new Date("2023-01-01T00:00:00Z"),
  stocks: {
    create: [
      {
        size: { connect: { id: "size1-id" } },
        quantity: 10,
      },
    ],
  },
};

export const fullProduct2 = {
  id: "product2-id",
  name: "반팔 티셔츠",
  price: 15000,
  image: "https://s3-url-2",
  content: "반팔 상세 설명",
  category: { connect: { id: "category2-id" } },
  store: { connect: { id: "store2-id" } },
  sales: 20,
  reviewsCount: 5,
  reviewsRating: 3.8,
  createdAt: new Date("2023-02-01T00:00:00Z"),
  stocks: {
    create: [{ size: { connect: { id: "size2-id" } }, quantity: 15 }],
  },
};

export const fullProduct3 = {
  id: "product3-id",
  name: "청바지",
  price: 30000,
  image: "https://s3-url-3",
  content: "청바지 상세 설명",
  category: { connect: { id: "category1-id" } },
  store: { connect: { id: "store1-id" } },
  sales: 100,
  reviewsCount: 25,
  reviewsRating: 4.9,
  createdAt: new Date("2023-01-15T00:00:00Z"),
  stocks: {
    create: [{ size: { connect: { id: "size3-id" } }, quantity: 5 }],
  },
};

export const fullProduct4 = {
  id: "product4-id",
  name: "후드티",
  price: 1,
  image: "https://s3-url-4",
  content: "후드티 상세 설명",
  category: { connect: { id: "category2-id" } },
  store: { connect: { id: "store2-id" } },
  sales: 40,
  reviewsCount: 15,
  reviewsRating: 4.1,
  createdAt: new Date("2023-03-01T00:00:00Z"),
  stocks: {
    create: [{ size: { connect: { id: "size1-id" } }, quantity: 20 }],
  },
};

export const fullProduct5 = {
  id: "product5-id",
  name: "운동화",
  price: 50000,
  image: "https://s3-url-5",
  content: "운동화 상세 설명",
  category: { connect: { id: "category3-id" } },
  store: { connect: { id: "store3-id" } },
  sales: 10,
  reviewsCount: 2,
  reviewsRating: 3.5,
  createdAt: new Date("2999-02-15T00:00:00Z"),
  stocks: {
    create: [{ size: { connect: { id: "size4-id" } }, quantity: 30 }],
  },
};

export const size2 = {
  id: "size2-id",
  size: "S",
};

export const size3 = {
  id: "size3-id",
  size: "M",
};

export const size4 = {
  id: "size4-id",
  size: "L",
};

export const category2 = {
  id: "category2-id",
  name: "전자제품",
};

export const category3 = {
  id: "category3-id",
  name: "생활용품",
};
