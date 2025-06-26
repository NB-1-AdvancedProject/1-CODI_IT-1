import request from "supertest";
import app from "../src/app";
import prisma from "../src/lib/prisma";
import { User, Product, Alarm } from "@prisma/client";
import { clearDatabase, createTestUser, getAuthenticatedReq } from "./testUtil";
import {
  buyerUser as buyer1,
  buyerUser2 as buyer2,
  sellerUser as seller1,
} from "./inquiryDummy";

describe("notification api 테스트", () => {
  let buyerUser: User;
  let buyerUser2: User;
  let product: Product;
  let sellerUser: User;
  let alarm: Alarm;
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

    alarm = await prisma.alarm.create({
      data: {
        userId: buyerUser.id,
        content: "테스트용 알림입니다.",
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/notifications/sse SSE연결", () => {
    test("SSE 연결 테스트", async () => {
      const authReq = getAuthenticatedReq(buyerUser.id);

      const response = await authReq
        .get("/api/notifications/sse")
        .set("Accept", "text/event-stream")
        .expect("Content-Type", /text\/event-stream/)
        .expect(200);

      expect(response.text).toContain("data:");
      expect(response.text).toContain("content");
    }, 5000);
  });

  describe("GET /api/notifications 조회", () => {
    test("알림을 조회할 수 있다.", async () => {
      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq.get("/api/notifications");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty("content");
    });
    test("알림을 조회할 수 있다(없는 userId).", async () => {
      const invalidUserId = "clabcxyz1234567890abcdefg";
      const authReq = getAuthenticatedReq(invalidUserId);
      const response = await authReq.get("/api/notifications");

      expect(response.status).toBe(401);
    });
  });

  describe("PATCH /api/notifications/alarmId/check 읽음처리", () => {
    test("알림을 읽음처리 할 수 있다.(성공)", async () => {
      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq.patch(
        `/api/notifications/${alarm.id}/check`
      );

      expect(response.status).toBe(200);
    });

    test("알림을 읽음처리 할 수 있다.(없는 유저)", async () => {
      const invalidUserId = "clabcxyz1234567890abcdefg";
      const authReq = getAuthenticatedReq(invalidUserId);
      const response = await authReq.patch(
        `/api/notifications/${alarm.id}/check`
      );

      expect(response.status).toBe(401);
    });

    test("알림을 읽음처리 할 수 있다.(ForbiddenError)", async () => {
      const authReq = getAuthenticatedReq(buyerUser2.id);
      const response = await authReq.patch(
        `/api/notifications/${alarm.id}/check`
      );
      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        message: "이메일 또는 비밀번호를 확인해주세요.",
      });
    });
  });
});
