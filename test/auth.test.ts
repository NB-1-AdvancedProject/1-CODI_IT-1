import request from "supertest";
import app from "../src/app";
import prisma from "../src/lib/prisma";
import bcrypt from "bcrypt";

describe("로그인 테스트", () => {
  const password = "Password@1234";
  const passwordHashed = bcrypt.hashSync(password, 10);

  beforeEach(async () => {
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
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST/api/auth", () => {
    test("로그인", async () => {
      const email = "test@test.com";
      const name = "김이박";
      const user = await prisma.user.create({
        data: {
          email,
          password: passwordHashed,
          name,
        },
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email, password });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.email).toBe("test@test.com");
    });
  });

  describe("POST/api/auth", () => {
    test("회원탈퇴시 로그인 안됨", async () => {
      const email = "test@test.com";
      const name = "김이박";
      const user = await prisma.user.create({
        data: {
          email,
          password: passwordHashed,
          name,
          deletedAt: new Date(),
        },
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email, password });
      expect(response.status).toBe(404);
    });
  });
});
