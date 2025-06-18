import request from "supertest";
import app from "../src/app";
import prisma from "../src/lib/prisma";
import { User, Product, InquiryStatus } from "@prisma/client";
import { clearDatabase, createTestUser, getAuthenticatedReq } from "./testUtil";
import { buyerUser as buyer1 } from "./inquiryDummy";

describe("문의 API 테스트", () => {
  let buyerUser: User;
  let product: Product;
  let token: string;
  beforeAll(async () => {
    await clearDatabase();

    buyerUser = await createTestUser(buyer1);

    const store = await prisma.store.create({
      data: {
        name: "테스트 상점",
        address: "서울시 강남구 테헤란로 123",
        phoneNumber: "010-1234-5678",
        content: "테스트 상점 설명",
        userId: buyerUser.id,
      },
    });

    const category = await prisma.category.create({
      data: {
        id: "c0fm6puffcuhepnyi73xibhcr", // 고정 id를 원하면 이렇게
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

    for (let i = 0; i < 20; i++) {
      await prisma.inquiry.create({
        data: {
          title: `상품 문의합니다.${i}`,
          content: `문의 내용입니다.${i}`,
          isSecret: false,
          status:
            i % 2 === 0
              ? InquiryStatus.noAnswer
              : InquiryStatus.completedAnswer,
          user: {
            connect: { id: buyerUser.id },
          },
          product: {
            connect: { id: product.id },
          },
        },
      });
    }
    const loginRes = await request(app).post("/api/auth/login").send({
      email: buyer1.email,
      password: buyer1.password,
    });

    token = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET api/inquiries", () => {
    test("내가 작성한 모든 문의를 조회할 수 있다.(페이지네이션 x)", async () => {
      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq.get("/api/inquiries");

      expect(response.body.totalCount).toBe(20);
      expect(response.body.list.length).toBe(10);
      expect(response.body.list[0]).toMatchObject({
        title: `상품 문의합니다.0`,
        content: `문의 내용입니다.0`,
        isSecret: false,
        status: "noAnswer",
      });
    });

    test("내가 작성한 모든 문의를 조회할 수 있다.(page)", async () => {
      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq.get("/api/inquiries?page=2");
      expect(response.body.list.length).toBe(10);
      expect(response.body.list[0]).toMatchObject({
        title: `상품 문의합니다.10`,
        content: `문의 내용입니다.10`,
        isSecret: false,
        status: "noAnswer",
      });
    });

    test("내가 작성한 모든 문의를 조회할 수 있다.(pageSize)", async () => {
      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq.get("/api/inquiries?pageSize=5");
      expect(response.body.list.length).toBe(5);
      expect(response.body.list[4]).toMatchObject({
        title: `상품 문의합니다.4`,
        content: `문의 내용입니다.4`,
        isSecret: false,
        status: "noAnswer",
      });
      expect(response.body.list[5]).toBeUndefined();
    });

    test("내가 작성한 모든 문의를 조회할 수 있다.(status)", async () => {
      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq.get(
        "/api/inquiries?status=completedAnswer"
      );
      expect(response.body.list.length).toBe(10);
      expect(response.body.list[0]).toMatchObject({
        title: `상품 문의합니다.1`,
        content: `문의 내용입니다.1`,
        isSecret: false,
        status: "completedAnswer",
      });
      expect(response.body.list[9]).toMatchObject({
        title: `상품 문의합니다.19`,
        content: `문의 내용입니다.19`,
        isSecret: false,
        status: "completedAnswer",
      });
    });
  });
});
