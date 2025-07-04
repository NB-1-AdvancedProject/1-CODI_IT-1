import request from "supertest";
import app from "../src/app";
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
  Review,
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

describe("PATCH /api/review/:reviewId", () => {
  let buyerWithPurchase: User;
  let buyerWithoutPurchase: User;
  let seller: User;
  let store: Store;
  let product1: Product;
  let orderItem1: OrderItem;
  let review: Review;
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
        reviewsCount: 1,
        reviewsRating: 5, // 테스트 편의를 위해 미리 저장
      },
    });
    const orderWithOrderItem = await createOrderAndOrderItems(
      buyerWithPurchase,
      product1,
      1
    );
    orderItem1 = orderWithOrderItem.orderItems[0];
    review = await prisma.review.create({
      data: {
        userId: buyerWithPurchase.id,
        productId: product1.id,
        orderItemId: orderItem1.id,
        rating: 5,
        content: "최고예요",
      },
    });
  });
  afterAll(async () => {
    await disconnectTestDB();
  });
  describe("성공", () => {
    test("기본동작: 자신이 작성한 리뷰를 수정할 수 있음", async () => {
      const authReq = getAuthenticatedReq(buyerWithPurchase.id);
      const response = await authReq.patch(`/api/review/${review.id}`).send({
        rating: 3,
      });
      expect(response.status).toBe(200);
      expect(response.body.rating).toBe(3);

      const updatedProduct = await prisma.product.findUnique({
        where: { id: product1.id },
      });
      expect(updatedProduct!.reviewsCount).toBe(1);
      expect(updatedProduct!.reviewsRating).toBe(3);
    });
  });
  describe("오류", () => {
    test("구매하지 않은 buyer 로 요청 시 UnauthError(401) 발생", async () => {
      const authReq = getAuthenticatedReq(buyerWithoutPurchase.id);
      const response = await authReq.patch(`/api/review/${review.id}`).send({
        rating: 3,
      });
      expect(response.status).toBe(401);
    });
    test("해당 Id의 리뷰가 존재하지 않을 시 NotFoundError(404) 발생", async () => {
      const authReq = getAuthenticatedReq(buyerWithPurchase.id);
      const nonExistentReviewId = "creview0000notfoundid0001";
      const response = await authReq
        .patch(`/api/review/${nonExistentReviewId}`)
        .send({
          rating: 3,
        });
      expect(response.status).toBe(404);
    });
  });
});
describe("GET /api/review/:reviewId", () => {
  let buyerWithPurchase: User;
  let buyerWithoutPurchase: User;
  let seller: User;
  let store: Store;
  let product1: Product;
  let orderItem1: OrderItem;
  let review: Review;
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
        reviewsCount: 1,
        reviewsRating: 5, // 테스트 편의를 위해 미리 저장
      },
    });
    const orderWithOrderItem = await createOrderAndOrderItems(
      buyerWithPurchase,
      product1,
      1
    );
    orderItem1 = orderWithOrderItem.orderItems[0];
    review = await prisma.review.create({
      data: {
        userId: buyerWithPurchase.id,
        productId: product1.id,
        orderItemId: orderItem1.id,
        rating: 5,
        content: "최고예요",
      },
    });
  });
  afterAll(async () => {
    await disconnectTestDB();
  });
  describe("성공", () => {
    test("기본동작: 누구든 리뷰 상세 조회를 할 수 있음", async () => {
      const authReq = getAuthenticatedReq(buyerWithoutPurchase.id);
      const response = await authReq.get(`/api/review/${review.id}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(review.id);
      expect(response.body.rating).toBe(review.rating);
      expect(response.body.userId).toBe(review.userId);
    });
  });
  describe("오류", () => {
    test("해당 Id 의 review 가 존재하지 않을 시 NotFoundError(404) 발생", async () => {
      const authReq = getAuthenticatedReq(buyerWithoutPurchase.id);
      const nonExistentReviewId = "creview0000notfoundid0001";
      const response = await authReq.get(`/api/review/${nonExistentReviewId}`);
      expect(response.status).toBe(404);
    });
  });
});
describe("DELETE /api/review/:reviewId", () => {
  let buyerWithReview: User;
  let buyerWithoutReview: User;
  let seller: User;
  let store: Store;
  let product1: Product;
  let orderItem1: OrderItem;
  let review: Review;
  beforeEach(async () => {
    await clearDatabase();
    buyerWithReview = await createTestUser(buyerData1);
    buyerWithoutReview = await createTestUser(buyerData2);
    seller = await createTestUser(sellerUser);
    await createTestSizes(sizes);
    await createTestCategories(categories);
    store = await createTestStore(store1, seller.id);
    product1 = await prisma.product.create({
      data: {
        ...dummyProduct1,
        storeId: store.id,
        reviewsCount: 1,
        reviewsRating: 5, // 테스트 편의를 위해 미리 저장
      },
    });
    const orderWithOrderItem = await createOrderAndOrderItems(
      buyerWithReview,
      product1,
      1
    );
    orderItem1 = orderWithOrderItem.orderItems[0];
    review = await prisma.review.create({
      data: {
        userId: buyerWithReview.id,
        productId: product1.id,
        orderItemId: orderItem1.id,
        rating: 5,
        content: "최고예요",
      },
    });
  });
  afterAll(async () => {
    await disconnectTestDB();
  });
  describe("성공", () => {
    test("기본동작: 리뷰를 작성한 사람은 리뷰를 삭제할 수 있음, 다시 조회시 존재하지 않음", async () => {
      const authReq = getAuthenticatedReq(buyerWithReview.id);
      const response = await authReq.delete(`/api/review/${review.id}`);
      console.warn(response.body);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("리뷰를 삭제했습니다.");
      const count = await prisma.review.count({ where: { id: review.id } });
      expect(count).toBe(0);
      const product = await prisma.product.findUnique({
        where: { id: product1.id },
      });
      expect(product?.reviewsCount).toBe(0);
      expect(product?.reviewsRating).toBe(0);
    });
  });
  describe("오류", () => {
    test("해당 Id 의 review 가 존재하지 않을 시 NotFoundError(404) 발생", async () => {
      const authReq = getAuthenticatedReq(buyerWithReview.id);
      const nonExistentReviewId = "creview0000notfoundid0001";
      const response = await authReq.delete(
        `/api/review/${nonExistentReviewId}`
      );
      expect(response.status).toBe(404);
    });
    test("자신이 작성하지 않은 review 를 삭제하려고 하면 UnAuthError(401) 발생", async () => {
      const authReq = getAuthenticatedReq(buyerWithoutReview.id);
      const response = await authReq.delete(`/api/review/${review.id}`);
      expect(response.status).toBe(401);
    });
  });
});

describe("GET /api/product/:productId/reviews", () => {
  let buyer1: User;
  let buyer2: User;
  let seller: User;
  let store: Store;
  let product1: Product;
  let orderItem1: OrderItem;
  let orderItem2: OrderItem;
  let review1: Review;
  let review2: Review;
  beforeAll(async () => {
    await clearDatabase();
    buyer1 = await createTestUser(buyerData1);
    buyer2 = await createTestUser(buyerData2);
    seller = await createTestUser(sellerUser);
    await createTestSizes(sizes);
    await createTestCategories(categories);
    store = await createTestStore(store1, seller.id);
    product1 = await prisma.product.create({
      data: {
        ...dummyProduct1,
        storeId: store.id,
        reviewsCount: 2,
        reviewsRating: 5, // 테스트 편의를 위해 미리 저장
      },
    });
    const orderWithOrderItem = await createOrderAndOrderItems(
      buyer1,
      product1,
      1
    );
    orderItem1 = orderWithOrderItem.orderItems[0];
    const orderWithOrderItem2 = await createOrderAndOrderItems(
      buyer2,
      product1,
      1
    );
    orderItem2 = orderWithOrderItem2.orderItems[0];
    review1 = await createTestReview(buyer1.id, product1.id, orderItem1.id);
    review2 = await createTestReview(buyer2.id, product1.id, orderItem2.id);
  });
  afterAll(async () => {
    await disconnectTestDB();
  });
  describe("성공", () => {
    test("기본동작: 로그인 하지 않아도 확인 가능 ", async () => {
      const response = await request(app).get(
        `/api/product/${product1.id}/reviews`
      );
      expect(response.status).toBe(200);
      // 정은 : 어차피 Swagger 가 이상한 것 같아서, 일단 여기까지만 테스트
    });
  });
  describe("오류", () => {
    test("존재하지 않는 product에 대해 조회시 NotFoundErr(404) 발생", async () => {
      const nonExistentProductId = "cproduct0000notfoundid0001";
      const response = await request(app).get(
        `/api/product/${nonExistentProductId}/reviews`
      );
      expect(response.status).toBe(404);
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

async function createTestReview(
  userId: string,
  productId: string,
  orderItemId: string
): Promise<Review> {
  return await prisma.review.create({
    data: {
      userId,
      productId,
      orderItemId,
      rating: 5,
      content: "최고예요",
    },
  });
}
