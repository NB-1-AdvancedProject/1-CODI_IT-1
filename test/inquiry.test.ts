import request from "supertest";
import app from "../src/app";
import prisma from "../src/lib/prisma";
import { User, Product, InquiryStatus } from "@prisma/client";
import bcrypt from "bcrypt";

describe("문의 API 테스트", () => {
  let user: User;
  let product: Product;
  beforeAll(async () => {
    let hashed = await bcrypt.hash("password123", 10);
    user = await prisma.user.create({
      data: {
        email: "user1@example.com",
        password: hashed,
        image: "image File",
        type: "BUYER",
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
          connect: { id: "c00ybxn0zrghstc93bzxiya4q" },
        },
        category: {
          connect: { id: "c0fm6puffcuhepnyi73xibhcr" },
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
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET api/inquiries", () => {
    test("내가 작성한 모든 문의를 조회할 수 있다.", async () => {
      const response = await request(app).get("/api/inquiries");
      expect(response.body.totalCount).toBe(20);
    });
  });
});
