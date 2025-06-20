import request from "supertest";
import app from "../src/app";
import prisma from "../src/lib/prisma";
import bcrypt from "bcrypt";
import { clearDatabase, getAuthenticatedReq } from "./testUtil";
import authService from "../src/services/authService";
import { connectRedis, getRedisClient } from "../src/utils/redis";
import { User } from "../src/types/user";

describe("로그인 테스트", () => {
  const password = "Password@1234";
  const passwordHashed = bcrypt.hashSync(password, 10);

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST/api/auth/login", () => {
    test("로그인", async () => {
      const email = "test1@test.com";
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
      expect(response.body.user.email).toBe("test1@test.com");
    });

    test("비밀번호 미일치", async () => {
      const email = "test2@test.com";
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
        .send({ email: "test2@test.com", password: "안녕하세여!!1234" });
      expect(response.status).toBe(403);
    });
  });
  test("회원탈퇴시 로그인 안됨", async () => {
    const email = "test3@test.com";
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

  describe("POST/api/auth/logout", () => {
    test("로그아웃", async () => {
      const email = "test4@test.com";
      const name = "김갑수";
      const logoutUser = await prisma.user.create({
        data: { email, password: passwordHashed, name },
      });

      const authReq = getAuthenticatedReq(logoutUser.id);
      const response = await authReq.post("/api/auth/logout").send({});
      expect(response.status).toBe(200);
    });
  });

  describe("POST/api/auth/refresh", () => {
    let redis: ReturnType<typeof getRedisClient>;
    let createUser: User;
    let initialRefreshToken: string;

    beforeAll(async () => {
      await clearDatabase();
      redis = await connectRedis();
    });

    beforeEach(async () => {
      await redis?.flushAll();

      createUser = await prisma.user.create({
        data: {
          email: "test5@test.com",
          name: "김말자",
          password: passwordHashed,
          type: "BUYER",
        },
      });

      initialRefreshToken = await authService.createToken(
        createUser,
        "refresh"
      );

      await authService.saveToken(createUser.id, initialRefreshToken);
    });

    afterEach(async () => {
      await prisma.user.delete({ where: { id: createUser.id } });
      await redis?.flushAll();
    });

    afterAll(async () => {
      await prisma.$disconnect();
      if (redis && redis.isReady) {
        await redis.quit();
      }
    });

    test("리프레시 토큰 정상 재발행", async () => {
      const response = await request(app)
        .post("/api/auth/refresh")
        .send({ refreshToken: initialRefreshToken })
        .expect(200);
    });

    test("리프레시 토큰 없으면 에러", async () => {
      const response = await request(app).post("/api/auth/refresh").send({});

      expect(response.status).toBe(400);
    });
  });
});
