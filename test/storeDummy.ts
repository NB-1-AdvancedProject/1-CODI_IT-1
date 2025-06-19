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
export const buyerUser2 = {
  email: "buyer2@example.com",
  name: "파는사람2",
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

// Category
export const categories = [
  {
    id: "clxcat00top000001",
    name: "상의",
    description: "티셔츠, 셔츠, 니트 등 상의류",
  },
  {
    id: "clxcat01bottom0002",
    name: "하의",
    description: "바지, 스커트 등 하의류",
  },
  {
    id: "clxcat02outer00003",
    name: "아우터",
    description: "자켓, 코트, 패딩 등 겉옷",
  },
  {
    id: "clxcat03shoes00004",
    name: "신발",
    description: "운동화, 부츠, 슬리퍼 등",
  },
  {
    id: "clxcat04bag000005",
    name: "가방",
    description: "백팩, 토트백, 크로스백 등",
  },
  {
    id: "clxcat05acc000006",
    name: "액세서리",
    description: "모자, 안경, 시계 등 패션 소품",
  },
];

// Size
export const sizes = [
  { id: "clxsize00xs000000", size: "Free" },
  { id: "clxsize01s000001", size: "S" },
  { id: "clxsize02m000002", size: "M" },
  { id: "clxsize03l000003", size: "L" },
  { id: "clxsize04xl00004", size: "XL" },
  { id: "clxsize05xxl0005", size: "XXL" },
];

// Product

export const product1 = {
  id: "clxprodlgop4n54ldsu",
  name: "가디건",
  image: "https://s3-URL",
  content: "상품 상세 설명",
  price: 100,
  categoryId: "clxcat02outer00003",
};
export const productWithDiscount = {
  id: "clxprodndoe2shfjiko",
  name: "신발",
  image: "https://shoes-URL",
  content: "신발 상세 설명",
  price: 100,
  categoryId: "clxcat03shoes00004",
  discountRate: 10,
  discountStartTime: new Date(),
  discountEndTime: new Date("9999-12-31T23:59:59.999Z"),
};

// Stocks
export const product1StocksQuantity18 = [
  {
    id: "clxstock00cardi01",
    productId: "clxprodlgop4n54ldsu",
    sizeId: "clxsize02m000002",
    quantity: 10,
  },
  {
    id: "clxstock01cardi02",
    productId: "clxprodlgop4n54ldsu",
    sizeId: "clxsize03l000003",
    quantity: 8,
  },
];

export const product2StocksQuantity0 = [
  {
    id: "clxstock02shoes01",
    productId: "clxprodndoe2shfjiko",
    sizeId: "clxsize04xl00004",
    quantity: 0,
  },
  {
    id: "clxstock03shoes02",
    productId: "clxprodndoe2shfjiko",
    sizeId: "clxsize05xxl0005",
    quantity: 0,
  },
];
