import prisma from "../src/lib/prisma";
import request from "supertest";
import app from "../src/app";
import bcrypt from "bcrypt";
import { User } from "../src/types/user";
import { Store } from "../src/types/storeType";
import { createAccessToken } from "../src/utils/jwt";

export async function clearDatabase() {
  await prisma.reply.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.review.deleteMany();
  await prisma.favoriteStore.deleteMany();
  await prisma.alarm.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.size.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();
  await prisma.grade.deleteMany();
}

export async function disconnectTestDB() {
  await prisma.$disconnect();
}

export async function createTestUser(userData: Omit<User, "id">) {
  const plainPassword = userData.password;
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  return prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
      type: userData.type,
    },
  });
}

export async function createTestSize(data: { id: string; size: string }[]) {
  return prisma.size.createMany({
    data: data,
    skipDuplicates: true,
  });
}

export async function createTestStore(
  storeData: Omit<Store, "id" | "userId">,
  userId: string
) {
  return prisma.store.create({
    data: {
      ...storeData,
      userId: userId,
    },
  });
}

export async function createTestFavoriteStore(storeId: string, userId: string) {
  return prisma.favoriteStore.create({
    data: { userId, storeId },
  });
}

export async function createTestCategory(data: {
  id?: string;
  name: string;
  description?: string;
}) {
  return prisma.category.create({ data });
}

export async function createTestProduct(data: {
  name: string;
  price: number;
  image: string;
  content: string;
  categoryId: string;
  storeId: string;
  discountRate?: number;
  discountStartTime?: Date;
  discountEndTime?: Date;
  sizeId?: string;
}) {
  return prisma.product.create({ data });
}

export async function createTestStock(data: {
  productId: string;
  sizeId: string;
  quantity: number;
}) {
  return prisma.stock.create({ data });
}

export async function createTestGrade(data: {
  name: string;
  pointRate: number;
  minAmount: number;
}) {
  return prisma.grade.create({ data });
}

export async function createTestOrder(data: {
  userId: string;
  address: string;
  phone: string;
  status:
    | "PENDING"
    | "PAID"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "REFUNDED";
  usePoint: number;
  subtotal: number;
}) {
  return prisma.order.create({ data });
}

export async function createTestOrderItem(data: {
  orderId: string;
  productId: string;
  sizeId: string;
  quantity: number;
  price: number;
}) {
  return prisma.orderItem.create({ data });
}

export async function createTestPayment(data: {
  orderId: string;
  status: "INITIATED" | "SUCCESS" | "FAIL" | "REFUNDED";
  totalPrice: number;
}) {
  return prisma.payment.create({ data });
}

export async function createTestCart(userId: string) {
  return prisma.cart.create({ data: { userId } });
}

export async function createTestCartItem(data: {
  cartId: string;
  productId: string;
  sizeId: string;
  quantity: number;
}) {
  return prisma.cartItem.create({ data });
}

export async function createTestInquiry(data: {
  productId: string;
  userId: string;
  title: string;
  content: string;
  isSecret: boolean;
  status: "completedAnswer" | "noAnswer";
}) {
  return prisma.inquiry.create({ data });
}

export async function createTestReply(data: {
  inquiryId: string;
  userId: string;
  content: string;
  isChecked: boolean;
}) {
  return prisma.reply.create({ data });
}

export async function createTestReview(data: {
  productId: string;
  userId: string;
  content: string;
  rating: number;
}) {
  return prisma.review.create({ data });
}

export async function createTestAlarm(data: {
  userId: string;
  content: string;
  isChecked?: boolean;
}) {
  return prisma.alarm.create({ data });
}

// agent 와 유사하게 header를 자동 세팅해주는 함수
// 사용법은 store.test.ts 를 참고하세요~
export function getAuthenticatedReq(userId: string) {
  const accessToken = createAccessToken(userId);
  const agent = request(app);

  return {
    get: (url: string) =>
      agent.get(url).set("Authorization", `Bearer ${accessToken}`),
    post: (url: string) =>
      agent.post(url).set("Authorization", `Bearer ${accessToken}`),
    put: (url: string) =>
      agent.put(url).set("Authorization", `Bearer ${accessToken}`),
    delete: (url: string) =>
      agent.delete(url).set("Authorization", `Bearer ${accessToken}`),
    patch: (url: string) =>
      agent.patch(url).set("Authorization", `Bearer ${accessToken}`),
  };
}
