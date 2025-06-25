import { OrderStatus, PaymentStatus, Prisma, Product } from "@prisma/client";
import prisma from "../src/lib/prisma";
import { User } from "../src/types/user";
import {
  clearDatabase,
  disconnectTestDB,
  getAuthenticatedReq,
} from "./testUtil";
import {
  buyerUser as buyerData,
  sellerUser,
  sellerUser2,
  store1,
  dummyProduct1,
  dummyProduct2,
  dummyProduct3,
  dummyProduct4,
  sizes,
  categories,
} from "./dashboardDummy";
import bcrypt from "bcrypt";
import { Store } from "../src/types/storeType";
import { Decimal } from "@prisma/client/runtime/library";

describe("GET /api/dashboard", () => {
  let buyerUser: User;
  let sellerWithStore: User;
  let store: Store;
  let sellerWithoutStore: User;
  let product1: Product;
  let product2: Product;
  let product3: Product;
  let product4: Product;

  beforeAll(async () => {
    await clearDatabase();
    buyerUser = await createTestUser(buyerData);
    sellerWithStore = await createTestUser(sellerUser);
    sellerWithoutStore = await createTestUser(sellerUser2);
    await createTestSizes(sizes);
    await createTestCategories(categories);
    store = await createTestStore(store1, sellerWithStore.id);
    product1 = await prisma.product.create({
      data: {
        ...dummyProduct1,
        storeId: store.id,
      },
    });
    product2 = await prisma.product.create({
      data: {
        ...dummyProduct2,
        storeId: store.id,
      },
    });
    product3 = await prisma.product.create({
      data: {
        ...dummyProduct3,
        storeId: store.id,
      },
    });
    product4 = await prisma.product.create({
      data: {
        ...dummyProduct4,
        storeId: store.id,
      },
    });
  });
  afterAll(async () => {
    await disconnectTestDB();
  });
  describe("성공", () => {
    test("기본동작: 판매자는 대시보드 데이터를 성공적으로 잘 가져옴", async () => {
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const lastWeekOrderDate = new Date(now);
      lastWeekOrderDate.setDate(
        lastWeekOrderDate.getDate() - lastWeekOrderDate.getDay() - 1
      );
      const lastMonthOrderDate = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );
      const lastYearOrderDate = new Date(now.getFullYear() - 1, 0, 1);
      // 오늘 판매 데이터
      const order1 = await createOrderAndOrderItems(
        buyerUser,
        product1,
        2,
        now
      );

      // 어제 판매 데이터
      const order2 = await createOrderAndOrderItems(
        buyerUser,
        product2,
        1,
        yesterday
      );

      // 지난 주 판매 데이터
      const order3 = await createOrderAndOrderItems(
        buyerUser,
        product3,
        3,
        lastWeekOrderDate
      );
      // 지난 달 판매 데이터
      const order4 = await createOrderAndOrderItems(
        buyerUser,
        product4,
        1,
        lastMonthOrderDate
      );
      // 작년 판매 데이터
      const order5 = await createOrderAndOrderItems(
        buyerUser,
        product1,
        1,
        lastYearOrderDate
      );

      // sales를 수동 업데이트 (실제와 맞지 않음, 그냥 테스트용)
      await prisma.product.update({
        where: { id: product1.id },
        data: { sales: 10 },
      });
      await prisma.product.update({
        where: { id: product2.id },
        data: { sales: 2 },
      });
      await prisma.product.update({
        where: { id: product3.id },
        data: { sales: 3 },
      });
      await prisma.product.update({
        where: { id: product4.id },
        data: { sales: 5 },
      });

      const authReq = getAuthenticatedReq(sellerWithStore.id);
      const response = await authReq.get("/api/dashboard");
      expect(response.status).toBe(200);
      // today
      expect(response.body.today.current.totalOrders).toBe(2);
      expect(response.body.today.current.totalSales).toBe(10000);
      expect(response.body.today.previous.totalOrders).toBe(1);
      expect(response.body.today.previous.totalSales).toBe(25000);
      expect(response.body.today.changeRate.totalOrders).toBe(200);
      expect(response.body.today.changeRate.totalSales).toBe(40);
      // week
      expect(response.body.week.current.totalOrders).toBe(3);
      expect(response.body.week.current.totalSales).toBe(35000);
      expect(response.body.week.previous.totalOrders).toBe(3);
      expect(response.body.week.previous.totalSales).toBe(225000);
      expect(response.body.week.changeRate.totalOrders).toBe(100);
      expect(response.body.week.changeRate.totalSales).toBe(16);
      // month
      expect(response.body.month.current.totalOrders).toBe(6);
      expect(response.body.month.current.totalSales).toBe(260000);
      expect(response.body.month.previous.totalOrders).toBe(1);
      expect(response.body.month.previous.totalSales).toBe(150000);
      expect(response.body.month.changeRate.totalOrders).toBe(600);
      expect(response.body.month.changeRate.totalSales).toBe(173);
      // year
      expect(response.body.year.current.totalOrders).toBe(7);
      expect(response.body.year.current.totalSales).toBe(410000);
      expect(response.body.year.previous.totalOrders).toBe(1);
      expect(response.body.year.previous.totalSales).toBe(5000);
      expect(response.body.year.changeRate.totalOrders).toBe(700);
      expect(response.body.year.changeRate.totalSales).toBe(8200);
      // topSales
      expect(response.body.topSales[0].totalOrders).toBe(10);
      expect(response.body.topSales[0].product.id).toBe(product1.id);
      expect(response.body.topSales[1].totalOrders).toBe(5);
      expect(response.body.topSales[1].product.id).toBe(product4.id);
      expect(response.body.topSales[2].totalOrders).toBe(3);
      expect(response.body.topSales[2].product.id).toBe(product3.id);
      expect(response.body.topSales[3].totalOrders).toBe(2);
      expect(response.body.topSales[3].product.id).toBe(product2.id);
      // priceRange
      expect(response.body.priceRange[0].priceRange).toBe("만원 미만");
      expect(response.body.priceRange[0].totalSales).toBe(15000);
      expect(response.body.priceRange[0].percentage).toBe(4);
      expect(response.body.priceRange[1].priceRange).toBe(
        "만원 이상 오만원 미만"
      );
      expect(response.body.priceRange[1].totalSales).toBe(25000);
      expect(response.body.priceRange[1].percentage).toBe(6);
      expect(response.body.priceRange[2].priceRange).toBe(
        "오만원 이상 십만원 미만"
      );
      expect(response.body.priceRange[2].totalSales).toBe(225000);
      expect(response.body.priceRange[2].percentage).toBe(54);
      expect(response.body.priceRange[3].priceRange).toBe("십만원 초과");
      expect(response.body.priceRange[3].totalSales).toBe(150000);
      expect(response.body.priceRange[3].percentage).toBe(36);
    });
  });
  describe("오류", () => {
    test("buyer 로 로그인 시 UnauthError(401) 발생", async () => {
      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq.get("/api/dashboard");
      expect(response.status).toBe(401);
    });
    test("스토어가 없는 seller일 시 NotFound(404) 발생", async () => {
      const authReq = getAuthenticatedReq(sellerWithoutStore.id);
      const response = await authReq.get("/api/dashboard");
      expect(response.status).toBe(404);
    });
  });
});

// 테스트용 함수들

export async function createTestUser(
  userData: Prisma.UserUncheckedCreateInput
) {
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

export async function createTestSizes(data: Prisma.SizeCreateInput[]) {
  return prisma.size.createMany({
    data: data,
    skipDuplicates: true,
  });
}
export async function createTestCategories(data: Prisma.CategoryCreateInput[]) {
  return prisma.category.createMany({
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

export async function createTestFavoriteStore(data: {
  userId: string;
  storeId: string;
  createdAt?: Date;
}) {
  return prisma.favoriteStore.create({ data });
}

export async function createTestStocks(data: Prisma.StockCreateManyInput[]) {
  return prisma.stock.createMany({
    data: data,
    skipDuplicates: true,
  });
}

export async function createOrderAndOrderItems(
  buyer: User,
  product: Product,
  quantity: number,
  paidAt: Date
) {
  return prisma.order.create({
    data: {
      userId: buyer.id,
      name: "주문",
      address: "테스트 주소",
      phone: "010-1234-5678",
      status: OrderStatus.PAID,
      usePoint: 0,
      subtotal: product.price.mul(quantity),
      paidAt,
      orderItems: {
        create: [
          {
            productId: product.id,
            sizeId: sizes[0].id,
            quantity,
            price: product.price,
          },
        ],
      },
    },
  });
}
