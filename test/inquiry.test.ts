import request from "supertest";
import app from "../src/app";
import prisma from "../src/lib/prisma";
import { User, Product, InquiryStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

describe("문의 API 테스트", () => {
  let user: User;
  let product: Product;
  let token: string;
  beforeAll(async () => {
    await prisma.inquiry.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.store.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.category.deleteMany({});

    let hashed = await bcrypt.hash("password123", 10);
    user = await prisma.user.create({
      data: {
        email: "user1@example.com",
        name: "김코딩",
        password: hashed,
        image: "image File",
        type: "SELLER",
      },
    });

    const store = await prisma.store.create({
      data: {
        name: "테스트 상점",
        address: "서울시 강남구 테헤란로 123",
        phoneNumber: "010-1234-5678",
        content: "테스트 상점 설명",
        userId: user.id,
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
      if (i % 2 === 0) {
        await prisma.inquiry.create({
          data: {
            title: ` 상품 문의합니다.${i}`,
            content: `문의 내용입니다.${i}`,
            isSecret: false,
            status: InquiryStatus.noAnswer,
            user: {
              connect: { id: user.id },
            },
            product: {
              connect: { id: product.id },
            },
          },
        });
      }

      if (i % 2 === 1) {
        await prisma.inquiry.create({
          data: {
            title: ` 상품 문의합니다.${i}`,
            content: `문의 내용입니다.${i}`,
            isSecret: false,
            status: InquiryStatus.completedAnswer,
            user: {
              connect: { id: user.id },
            },
            product: {
              connect: { id: product.id },
            },
          },
        });
      }
    }
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "user1@example.com",
      password: "password123",
    });

    token = loginRes.body.accessToken;

    console.log("로그인 user id:", user.id);
    console.log("token payload user id:", jwt.decode(token));
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET api/inquiries", () => {
    test("내가 작성한 모든 문의를 조회할 수 있다.", async () => {
      console.log("token:", token);
      const response = await request(app)
        .get("/api/inquiries")
        .set("Authorization", `Bearer ${token}`);
      console.log("응답 결과:", response.body);
      expect(response.body.totalCount).toBe(20);
    });
  });
});
