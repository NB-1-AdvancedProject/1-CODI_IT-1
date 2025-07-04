import request from "supertest";
import app from "../src/app";
import prisma from "../src/lib/prisma";
import { User, Product, InquiryStatus, Inquiry, Reply } from "@prisma/client";
import { clearDatabase, createTestUser, getAuthenticatedReq } from "./testUtil";
import {
  buyerUser as buyer1,
  buyerUser2 as buyer2,
  sellerUser as seller1,
} from "./inquiryDummy";

describe("문의 API 테스트", () => {
  let buyerUser: User;
  let buyerUser2: User;
  let product: Product;
  let sellerUser: User;
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
    await request(app).post("/api/auth/login").send({
      email: buyer1.email,
      password: buyer1.password,
    });
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
        title: `상품 문의합니다.19`,
        content: `문의 내용입니다.19`,
        isSecret: false,
        status: "completedAnswer",
      });
    });

    test("내가 작성한 모든 문의를 조회할 수 있다.(page)", async () => {
      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq.get("/api/inquiries?page=2");
      expect(response.body.list.length).toBe(10);
      expect(response.body.list[0]).toMatchObject({
        title: `상품 문의합니다.9`,
        content: `문의 내용입니다.9`,
        isSecret: false,
        status: "completedAnswer",
      });
    });

    test("내가 작성한 모든 문의를 조회할 수 있다.(pageSize)", async () => {
      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq.get("/api/inquiries?pageSize=5");
      expect(response.body.list.length).toBe(5);
      expect(response.body.list[4]).toMatchObject({
        title: `상품 문의합니다.15`,
        content: `문의 내용입니다.15`,
        isSecret: false,
        status: "completedAnswer",
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
        title: `상품 문의합니다.19`,
        content: `문의 내용입니다.19`,
        isSecret: false,
        status: "completedAnswer",
      });
      expect(response.body.list[9]).toMatchObject({
        title: `상품 문의합니다.1`,
        content: `문의 내용입니다.1`,
        isSecret: false,
        status: "completedAnswer",
      });
    });
  });

  describe("PATCH api/inquiries/:id", () => {
    let inquiry: Inquiry;
    beforeAll(async () => {
      inquiry = await prisma.inquiry.create({
        data: {
          title: `상품 문의합니다.`,
          content: `문의 내용입니다.`,
          isSecret: false,
          status: InquiryStatus.noAnswer,
          user: {
            connect: { id: buyerUser.id },
          },
          product: {
            connect: { id: product.id },
          },
        },
      });
    });

    test("내가 작성한 문의를 수정할 수 있다.(성공)", async () => {
      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq
        .patch(`/api/inquiries/${inquiry.id}`)
        .send({
          title: "상품 문의합니다.",
          content: "문의 내용입니다.",
          isSecret: false,
        });

      expect(response.body).toMatchObject({
        title: `상품 문의합니다.`,
        content: `문의 내용입니다.`,
        isSecret: false,
        status: InquiryStatus.noAnswer,
      });
    });

    test("내가 작성한 문의를 수정할 수 있다.(문의 조회 실패))", async () => {
      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq
        .patch(`/api/inquiries/${"clabcxyz1234567890abcdefg"}`)
        .send({
          title: "상품 문의합니다.",
          content: "문의 내용입니다.",
          isSecret: false,
        });

      expect(response.status).toBe(404);
    });

    test("내가 작성한 문의를 수정할 수 있다.(내가 작성한 문의 x)", async () => {
      const authReq = getAuthenticatedReq(sellerUser.id);
      const response = await authReq
        .patch(`/api/inquiries/${inquiry.id}`)
        .send({
          title: "상품 문의합니다.",
          content: "문의 내용입니다.",
          isSecret: false,
        });

      expect(response.body).toEqual({ message: "Unauthorized" });
      expect(response.status).toBe(401);
    });
  });

  describe("DELETE api/inquiries/:id", () => {
    let inquiry: Inquiry;
    beforeAll(async () => {
      inquiry = await prisma.inquiry.create({
        data: {
          title: `상품 문의합니다.`,
          content: `문의 내용입니다.`,
          isSecret: false,
          status: InquiryStatus.noAnswer,
          user: {
            connect: { id: buyerUser.id },
          },
          product: {
            connect: { id: product.id },
          },
        },
      });
    });

    test("내가 작성한 문의를 삭제 할 수 있다.(성공)", async () => {
      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq
        .patch(`/api/inquiries/${inquiry.id}`)
        .send({
          title: "상품 문의합니다.",
          content: "문의 내용입니다.",
          isSecret: false,
        });

      expect(response.body).toMatchObject({
        title: `상품 문의합니다.`,
        content: `문의 내용입니다.`,
        isSecret: false,
        status: InquiryStatus.noAnswer,
      });
    });

    test("내가 작성한 문의를 삭제 할 수 있다.(문의 조회 실패))", async () => {
      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq.delete(
        `/api/inquiries/${"clabcxyz1234567890abcdefg"}`
      );

      expect(response.status).toBe(404);
    });

    test("내가 작성한 문의를 수정할 수 있다.(내가 작성한 문의 x)", async () => {
      const authReq = getAuthenticatedReq(sellerUser.id);
      const response = await authReq.delete(`/api/inquiries/${inquiry.id}`);

      expect(response.body).toEqual({ message: "Unauthorized" });
      expect(response.status).toBe(401);
    });
  });

  describe("POST api/inquiries/:id/replies", () => {
    let inquiry: Inquiry;
    beforeAll(async () => {
      inquiry = await prisma.inquiry.create({
        data: {
          title: `상품 문의합니다.`,
          content: `문의 내용입니다.`,
          isSecret: false,
          status: InquiryStatus.noAnswer,
          user: {
            connect: { id: buyerUser.id },
          },
          product: {
            connect: { id: product.id },
          },
        },
      });
    });

    test("문의에 답변 할 수 있다.(성공)", async () => {
      const authReq = getAuthenticatedReq(sellerUser.id);
      const response = await authReq
        .post(`/api/inquiries/${inquiry.id}/replies`)
        .send({
          content: "답변 내용입니다.",
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        content: "답변 내용입니다.",
      });
    });

    test("문의에 답변 할 수 있다.(실패 - 문의 없음)", async () => {
      const authReq = getAuthenticatedReq(sellerUser.id);
      const response = await authReq
        .post(`/api/inquiries/${"clabcxyz1234567890abcdefg"}/replies`)
        .send({
          content: "답변 내용입니다.",
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: `Inquiry with ${"clabcxyz1234567890abcdefg"} not found`,
      });
    });

    test("문의에 답변 할 수 있다.(실패 - seller 아님)", async () => {
      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq
        .post(`/api/inquiries/${inquiry.id}/replies`)
        .send({
          content: "답변 내용입니다.",
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: "Unauthorized" });
    });
  });

  describe("PATCH api/inquiries/:id/replies", () => {
    let inquiry: Inquiry;
    let replay: Reply;
    beforeAll(async () => {
      inquiry = await prisma.inquiry.create({
        data: {
          title: `상품 문의합니다.`,
          content: `문의 내용입니다.`,
          isSecret: false,
          status: InquiryStatus.noAnswer,
          user: {
            connect: { id: buyerUser.id },
          },
          product: {
            connect: { id: product.id },
          },
        },
      });

      replay = await prisma.reply.create({
        data: {
          content: "이 제품은 재입고 예정입니다.",
          createdAt: "2024-06-01T12:00:00.000Z",
          updatedAt: "2024-06-01T12:00:00.000Z",
          user: { connect: { id: sellerUser.id } },
          inquiry: { connect: { id: inquiry.id } },
        },
      });
    });

    test("문의 답변을 수정 할 수 있다.(성공)", async () => {
      const authReq = getAuthenticatedReq(sellerUser.id);
      const response = await authReq
        .patch(`/api/inquiries/${replay.id}/replies`)
        .send({
          content: "답변 내용입니다.",
        });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        content: "답변 내용입니다.",
      });
    });

    test("문의 답변을 수정 할 수 있다.(실패- 권한없음)", async () => {
      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq
        .patch(`/api/inquiries/${replay.id}/replies`)
        .send({
          content: "답변 내용입니다.",
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: "Unauthorized" });
    });

    test("문의 답변을 수정 할 수 있다.(reply 없음)", async () => {
      const authReq = getAuthenticatedReq(sellerUser.id);
      const response = await authReq
        .patch(`/api/inquiries/${"clabcxyz1234567890abcdefg"}/replies`)
        .send({
          content: "답변 내용입니다.",
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: "Reply with clabcxyz1234567890abcdefg not found",
      });
    });
  });

  describe("GET api/inquiries/:id", () => {
    let inquiry1: Inquiry;
    let inquiry2: Inquiry;

    beforeAll(async () => {
      inquiry1 = await prisma.inquiry.create({
        data: {
          title: `상품 문의합니다.`,
          content: `문의 내용입니다.`,
          isSecret: true,
          status: InquiryStatus.noAnswer,
          user: {
            connect: { id: buyerUser.id },
          },
          product: {
            connect: { id: product.id },
          },
        },
      });

      inquiry2 = await prisma.inquiry.create({
        data: {
          title: `상품 문의합니다.`,
          content: `문의 내용입니다.`,
          isSecret: false,
          status: InquiryStatus.noAnswer,
          user: {
            connect: { id: buyerUser.id },
          },
          product: {
            connect: { id: product.id },
          },
        },
      });
    });

    test("문의를 상세 조회 할 수 있다.(로그인 조회)", async () => {
      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq.get(`/api/inquiries/${inquiry1.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        title: `상품 문의합니다.`,
        content: `문의 내용입니다.`,
        isSecret: true,
      });
    });

    test("문의를 상세 조회 할 수 있다.(비로그인 조회)", async () => {
      const response = await request(app).get(`/api/inquiries/${inquiry2.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        title: `상품 문의합니다.`,
        content: `문의 내용입니다.`,
        isSecret: false,
      });
    });

    test("문의를 상세 조회 할 수 있다.(판매자 문의 조회)", async () => {
      const authReq = getAuthenticatedReq(sellerUser.id);
      const response = await authReq.get(`/api/inquiries/${inquiry1.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        title: `상품 문의합니다.`,
        content: `문의 내용입니다.`,
        isSecret: true,
      });
    });

    test("문의를 상세 조회 할 수 있다.(다른 유저 문의 조회)", async () => {
      const authReq = getAuthenticatedReq(buyerUser2.id);
      const response = await authReq.get(`/api/inquiries/${inquiry1.id}`);
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: "Unauthorized" });
    });

    test("문의를 상세 조회 할 수 있다.(isSecret =true , 비로그인 테스트)", async () => {
      const response = await request(app).get(`/api/inquiries/${inquiry1.id}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: `Inquiry with ${inquiry1.id} not found`,
      });
    });
  });

  describe("GET api/inquiries/:id/replies", () => {
    let inquiry1: Inquiry;
    let inquiry2: Inquiry;
    let reply1: Reply;
    let reply2: Reply;

    beforeAll(async () => {
      inquiry1 = await prisma.inquiry.create({
        data: {
          title: `상품 문의합니다.`,
          content: `문의 내용입니다.`,
          isSecret: true,
          status: InquiryStatus.noAnswer,
          user: {
            connect: { id: buyerUser.id },
          },
          product: {
            connect: { id: product.id },
          },
        },
      });

      inquiry2 = await prisma.inquiry.create({
        data: {
          title: `상품 문의합니다.`,
          content: `문의 내용입니다.`,
          isSecret: false,
          status: InquiryStatus.noAnswer,
          user: {
            connect: { id: buyerUser.id },
          },
          product: {
            connect: { id: product.id },
          },
        },
      });

      reply1 = await prisma.reply.create({
        data: {
          content: "이 제품은 재입고 예정입니다.",
          createdAt: new Date("2024-06-01T12:00:00.000Z"),
          updatedAt: new Date("2024-06-01T12:00:00.000Z"),
          user: {
            connect: { id: sellerUser.id },
          },
          inquiry: {
            connect: { id: inquiry1.id },
          },
        },
      });

      reply2 = await prisma.reply.create({
        data: {
          content: "이 제품은 재입고 예정입니다.",
          createdAt: new Date("2024-06-01T12:00:00.000Z"),
          updatedAt: new Date("2024-06-01T12:00:00.000Z"),
          user: {
            connect: { id: sellerUser.id },
          },
          inquiry: {
            connect: { id: inquiry2.id },
          },
        },
      });
    });

    test("문의답변을 상세 조회 할 수 있다.(로그인 조회)", async () => {
      const authReq = getAuthenticatedReq(sellerUser.id);
      const response = await authReq.get(`/api/inquiries/${reply1.id}/replies`);
      expect(response.status).toBe(200);
      expect(response.body.reply).toMatchObject({
        content: "이 제품은 재입고 예정입니다.",
      });
    });

    test("문의답변을 상세 조회 할 수 있다.(로그인 조회 문의자)", async () => {
      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq.get(`/api/inquiries/${reply1.id}/replies`);
      expect(response.status).toBe(200);
      expect(response.body.reply).toMatchObject({
        content: "이 제품은 재입고 예정입니다.",
      });
    });

    test("문의답변을 상세 조회 할 수 있다.(비로그인 조회)", async () => {
      const response = await request(app).get(
        `/api/inquiries/${reply2.id}/replies`
      );
      expect(response.status).toBe(200);
    });

    test("문의답변을 상세 조회 할 수 있다.(로그인 권한 실패)", async () => {
      const authReq = getAuthenticatedReq(buyerUser2.id);
      const response = await authReq.get(`/api/inquiries/${reply1.id}/replies`);
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: "Unauthorized" });
    });

    test("문의답변을 상세 조회 할 수 있다.(비로그인 secret true 조회)", async () => {
      const response = await request(app).get(
        `/api/inquiries/${reply1.id}/replies`
      );
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: `Inquiry with ${inquiry1.id} not found`,
      });
    });
  });

  describe("POST api/products/:id/inquiries", () => {
    test("상품에 대한 문의를 생성할 수 있다(성공)", async () => {
      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq
        .post(`/api/products/${product.id}/inquiries`)
        .send({
          title: " 상품 문의합니다.",
          content: "문의 내용입니다.",
          isSecret: false,
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        title: " 상품 문의합니다.",
        content: "문의 내용입니다.",
        isSecret: false,
      });
    });

    test("상품에 대한 문의를 판매자가 올릴 수 없다.(실패-판매자 문의)", async () => {
      const authReq = getAuthenticatedReq(sellerUser.id);
      const response = await authReq
        .post(`/api/products/${product.id}/inquiries`)
        .send({
          title: " 상품 문의합니다.",
          content: "문의 내용입니다.",
          isSecret: false,
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: "Unauthorized" });
    });

    test("상품이 없음(실패-상품 X)", async () => {
      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq
        .post(`/api/products/${"clabcxyz1234567890abcdefg"}/inquiries`)
        .send({
          title: " 상품 문의합니다.",
          content: "문의 내용입니다.",
          isSecret: false,
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: `Product with ${"clabcxyz1234567890abcdefg"} not found`,
      });
    });
  });

  describe("GET api/products/:id/inquiries", () => {
    beforeAll(async () => {
      await prisma.reply.deleteMany({});
      await prisma.inquiry.deleteMany({});
      for (let i = 0; i < 20; i++) {
        await prisma.inquiry.create({
          data: {
            title: `상품 문의합니다.${i}`,
            content: `문의 내용입니다.${i}`,
            isSecret: i % 2 === 0 ? false : true,
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
    });

    test("문의 전체 조회 단 isSecret 제외", async () => {
      const response = await request(app).get(
        `/api/products/${product.id}/inquiries`
      );
      expect(response.status).toBe(200);
      expect(response.body[0]).toMatchObject({
        title: `상품 문의합니다.18`,
        content: `문의 내용입니다.18`,
        isSecret: false,
      });
      expect(response.body[9]).toMatchObject({
        title: `상품 문의합니다.0`,
        content: `문의 내용입니다.0`,
        isSecret: false,
      });
    });

    test("문의 전체 조회 단 isSecret 제외(product 자체가 없음 실패", async () => {
      const response = await request(app).get(
        `/api/products/${"clabcxyz1234567890abcdefg"}/inquiries`
      );

      expect(response.status).toBe(404);
      expect(response.body.length).toBeUndefined();
      expect(response.body).toEqual({
        message: `Product with ${"clabcxyz1234567890abcdefg"} not found`,
      });
    });
  });
});
