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

// --- Product Data ---
export const dummyProduct1 = {
  id: "clxprodlgop4n54ldsu",
  name: "테스트 가디건",
  image: "https://example.com/images/cardigan.jpg",
  content: "편안한 착용감의 니트 가디건입니다.",
  price: new Decimal(5000),
  categoryId: "clxcat02outer00003",
  createdAt: new Date("2024-05-10T12:00:00Z"),
  updatedAt: new Date("2024-05-10T12:00:00Z"),
};

export const dummyProduct2 = {
  id: "clxprodndoe2shfjiko",
  name: "테스트 운동화",
  image: "https://example.com/images/shoes.jpg",
  content: "가볍고 통기성 좋은 데일리 운동화.",
  price: new Decimal(25000),
  categoryId: "clxcat03shoes00004",
  createdAt: new Date("2024-05-11T13:00:00Z"),
  updatedAt: new Date("2024-05-11T13:00:00Z"),
};

export const dummyProduct3 = {
  id: "clxprodxzyw789abcde",
  name: "테스트 자켓",
  image: "https://example.com/images/jacket.jpg",
  content: "스타일리쉬한 봄/가을 자켓.",
  price: new Decimal(75000),
  categoryId: "clxcat02outer00003",
  createdAt: new Date("2024-05-12T14:00:00Z"),
  updatedAt: new Date("2024-05-12T14:00:00Z"),
};

export const dummyProduct4 = {
  id: "clxprodmlkjhgfdsa",
  name: "테스트 코트",
  image: "https://example.com/images/coat.jpg",
  content: "고급스러운 울 소재의 겨울 코트.",
  price: new Decimal(150000),
  categoryId: "clxcat02outer00003",
  createdAt: new Date("2024-05-13T15:00:00Z"),
  updatedAt: new Date("2024-05-13T15:00:00Z"),
};
