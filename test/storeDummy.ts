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

// Product

export const product1 = {
  name: "가디건",
  image: "https://s3-URL",
  content: "상품 상세 설명",
  price: 100, // 정은 Todo : util 변경되면 decimal 로 바꿔야 할듯?
  categoryId: "clxcat02outer00003",
};
export const product2 = {
  name: "신발",
  image: "https://shoes-URL",
  content: "신발 상세 설명",
  price: 100, // 정은 Todo : util 변경되면 decimal 로 바꿔야 할듯?
  categoryId: "clxcat03shoes00004",
};
