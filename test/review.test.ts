import bcrypt from "bcrypt";
import {
  clearDatabase,
  disconnectTestDB,
  getAuthenticatedReq,
} from "./testUtil";
import {
  buyerUser as buyerData1,
  buyerUser2 as buyerData2,
  sellerUser,
  store1,
  dummyProduct1,
  sizes,
  categories,
} from "./dashboardDummy";
import {
  OrderItem,
  OrderStatus,
  Prisma,
  Product,
  Store,
  User,
} from "@prisma/client";
import prisma from "../src/lib/prisma";

describe("POST /api/product/:productId/reviews", () => {
  let buyerWithPurchase: User;
  let buyerWithoutPurchase: User;
  let seller: User;
  let store: Store;
  let product1: Product;
  let orderItem1: OrderItem;
  beforeAll(async () => {
    await clearDatabase();
    buyerWithPurchase = await createTestUser(buyerData1);
    buyerWithoutPurchase = await createTestUser(buyerData2);
    seller = await createTestUser(sellerUser);
    await createTestSizes(sizes);
    await createTestCategories(categories);
    store = await createTestStore(store1, seller.id);
    product1 = await prisma.product.create({
      data: {
        ...dummyProduct1,
        storeId: store.id,
      },
    });
    const orderWithOrderItem = await createOrderAndOrderItems(
      buyerWithPurchase,
      product1,
      1
    );
    orderItem1 = orderWithOrderItem.orderItems[0];
  });

  afterAll(async () => {
    await disconnectTestDB();
  });
  describe("성공", () => {
    test("기본동작: 구매한 상품에 대해서 리뷰를 생성할 수 있음", async () => {
      const authReq = getAuthenticatedReq(buyerWithPurchase.id);
      const response = await authReq
        .post(`/api/product/${product1.id}/reviews`)
        .send({
          orderItemId: orderItem1.id,
          rating: 5,
          content: "최고에요!",
        });
      expect(response.status).toBe(201);
      expect(response.body.userId).toBe(buyerWithPurchase.id);
      expect(response.body.productId).toBe(product1.id);
      expect(response.body.rating).toBe(5);
      expect(response.body.content).toBe("최고에요!");

      const updatedProduct = await prisma.product.findUnique({
        where: { id: product1.id },
      });
      expect(updatedProduct!.reviewsCount).toBe(1);
      expect(updatedProduct!.reviewsRating).toBe(5);
    });
    describe("오류", () => {
      test("구매하지 않은 buyer 로 요청 시 UnauthError(401) 발생", async () => {
        const authReq = getAuthenticatedReq(buyerWithoutPurchase.id);
        const response = await authReq
          .post(`/api/product/${product1.id}/reviews`)
          .send({
            orderItemId: orderItem1.id,
            rating: 5,
            content: "최고에요!",
          });
        expect(response.status).toBe(401);
      });
      test("이미 해당 주문에 대해서 리뷰를 달았을 시 AlreadyExistError(409) 발생", async () => {
        const authReq = getAuthenticatedReq(buyerWithPurchase.id);
        const response = await authReq
          .post(`/api/product/${product1.id}/reviews`)
          .send({
            orderItemId: orderItem1.id,
            rating: 5,
            content: "최고에요!",
          });
        expect(response.status).toBe(409);
      });
    });
  });
});

// 테스트용 함수들
async function createTestUser(userData: Prisma.UserUncheckedCreateInput) {
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

async function createTestSizes(data: Prisma.SizeCreateInput[]) {
  return prisma.size.createMany({
    data: data,
    skipDuplicates: true,
  });
}
async function createTestCategories(data: Prisma.CategoryCreateInput[]) {
  return prisma.category.createMany({
    data: data,
    skipDuplicates: true,
  });
}

async function createTestStore(
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

async function createTestFavoriteStore(data: {
  userId: string;
  storeId: string;
  createdAt?: Date;
}) {
  return prisma.favoriteStore.create({ data });
}

async function createTestStocks(data: Prisma.StockCreateManyInput[]) {
  return prisma.stock.createMany({
    data: data,
    skipDuplicates: true,
  });
}

async function createOrderAndOrderItems(
  buyer: User,
  product: Product,
  quantity: number,
  paidAt: Date = new Date()
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
    include: { orderItems: true },
  });
}
