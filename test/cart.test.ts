import request from "supertest";
import app from "../src/app";
import prisma from "../src/lib/prisma";
import {
  User,
  Product,
  InquiryStatus,
  Inquiry,
  Reply,
  Cart,
  Size,
} from "@prisma/client";
import { clearDatabase, createTestUser, getAuthenticatedReq } from "./testUtil";
import {
  buyerUser as buyer1,
  buyerUser2 as buyer2,
  sellerUser as seller1,
} from "./inquiryDummy";

describe("카트 API 테스트", () => {
  let buyerUser: User;
  let buyerUser2: User;
  let product: Product;
  let sellerUser: User;
  let cart: Cart;
  let size: Size;

  beforeAll(async () => {
    await clearDatabase();
    buyerUser = await createTestUser(buyer1);
    buyerUser2 = await createTestUser(buyer2);
    sellerUser = await createTestUser(seller1);
    const store = await prisma.store.create({
      data: {
        name: "테스트 상점",
        address: "서울시 강남구 테헤란로 123",
        phoneNumber: "010-1234-5678",
        content: "테스트 상점 설명",
        userId: sellerUser.id,
      },
    });
    await prisma.user.update({
      where: { id: sellerUser.id },
      data: { storeId: store.id },
    });

    const category = await prisma.category.create({
      data: {
        id: "c0fm6puffcuhepnyi73xibhcr",
        name: "테스트 카테고리",
      },
    });

    product = await prisma.product.create({
      data: {
        name: "테스트 상품",
        price: 10000,
        image: "image url",
        content: "상품 설명입니다",
        sales: 0,
        store: {
          connect: { id: store.id },
        },
        category: {
          connect: { id: category.id },
        },
      },
    });

    cart = await prisma.cart.create({
      data: {
        userId: buyerUser.id,
      },
    });

    size = await prisma.size.create({
      data: {
        size: "M",
      },
    });

    const stock = await prisma.stock.create({
      data: {
        productId: product.id,
        sizeId: size.id,
        quantity: 10,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/cart", () => {
    beforeEach(async () => {
      await prisma.cart.deleteMany();
    });
    test("카트를 생성할 수 있다.(성공)", async () => {
      const authReq = await getAuthenticatedReq(buyerUser.id);

      const response = await authReq.post("/api/cart").send();

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("buyerId", buyerUser.id);
      expect(response.body).toHaveProperty("quantity", 0);
      expect(response.body).toHaveProperty("createdAt");
      expect(response.body).toHaveProperty("updatedAt");
    });

    test("카트를 생성할 수 있다.(실패)", async () => {
      const invalidUserId = "non-existent-user-id";

      const authReq = await getAuthenticatedReq(invalidUserId);

      const response = await authReq.post("/api/cart");
      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/cart", () => {
    beforeAll(async () => {
      await prisma.cart.deleteMany();
      cart = await prisma.cart.create({
        data: {
          userId: buyerUser.id,
        },
      });

      for (let i = 0; i < 10; i++) {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: product.id,
            sizeId: size.id,
            quantity: i + 1,
          },
        });
      }
    });
    test("카트 아이템을 조회할 수 있다(성공)", async () => {
      const authReq = await getAuthenticatedReq(buyerUser.id);
      const response = await authReq.get("/api/cart");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.items.length).toBeGreaterThan(0);
      expect(response.body.items[0].quantity).toBe(1);
    });

    test("카트 아이템 조회 실패 (없는 userId)", async () => {
      const invalidUserId = "non-existent-user-id";

      const authReq = await getAuthenticatedReq(invalidUserId);
      const response = await authReq.get("/api/cart");

      expect(response.status).toBe(401);
    });

    test("카트 아이템 조회 실패 (카트 없음)", async () => {
      const authReq = await getAuthenticatedReq(buyerUser2.id);
      const response = await authReq.get("/api/cart");
      expect(response.status).toBe(404);
    });
  });

  describe("PATCH /api/cart", () => {
    beforeAll(async () => {
      await prisma.cart.deleteMany();
      cart = await prisma.cart.create({
        data: {
          userId: buyerUser.id,
        },
      });
    });
    test("카트 아이템 추가/아이템 수량 수정 (성공)", async () => {
      const authReq = await getAuthenticatedReq(buyerUser.id);
      const response = await authReq.patch("/api/cart").send({
        productId: product.id,
        sizes: [
          {
            sizeId: size.id,
            quantity: 3,
          },
        ],
      });
      expect(response.status).toBe(200);
    });

    test("카트 아이템 추가/아이템 수량 수정 (없는 userId)", async () => {
      const invalidUserId = "non-existent-user-id";

      const authReq = await getAuthenticatedReq(invalidUserId);

      const response = await authReq.patch("/api/cart").send({
        productId: product.id,
        sizes: [
          {
            sizeId: size.id,
            quantity: 3,
          },
        ],
      });
      expect(response.status).toBe(401);
    });
    test("카트 아이템 추가/아이템 수량 수정 (카트 없음)", async () => {
      const authReq = await getAuthenticatedReq(buyerUser2.id);
      const response = await authReq.patch("/api/cart").send({
        productId: product.id,
        sizes: [
          {
            sizeId: size.id,
            quantity: 3,
          },
        ],
      });
      expect(response.status).toBe(404);
    });
  });
});
