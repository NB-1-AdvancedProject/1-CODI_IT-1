import request from "supertest";
import app from "../src/app";
import prisma from "../src/lib/prisma";
import bcrypt from "bcrypt";
import {
  clearDatabase,
  createTestUser,
  disconnectTestDB,
  getAuthenticatedReq,
} from "./testUtil";
import { buyerUser as buyer1 } from "./storeDummy";
import { User } from "@prisma/client";

describe("유저 생성 기능", () => {
  beforeAll(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  describe("POST /api/users", () => {
    test("회원 가입", async () => {
      const email = "test@test.com";
      const password = "Password@1234";
      const name = "홍길자";

      const response = await request(app)
        .post("/api/users")
        .send({ email, password, name, type: "BUYER" });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("name", "홍길자");
    });

    test("중복 이메일 회원 가입", async () => {
      const password = "Password@1234";
      const passwordHashed = bcrypt.hashSync(password, 10);

      const user1 = await prisma.user.create({
        data: {
          email: "test1@test.com",
          password: passwordHashed,
          name: "홍길자",
          type: "BUYER",
        },
      });

      const response = await request(app).post("/api/users").send({
        email: "test1@test.com",
        password: password,
        name: "김강남",
        type: "BUYER",
      });

      expect(response.status).toBe(409);
    });
  });
});

describe("내 정보 조회", () => {
  beforeAll(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/users/me", () => {
    beforeAll(async () => {
      await clearDatabase();
    });
    afterAll(async () => {
      await disconnectTestDB();
    });
    describe("성공", () => {
      test("로그인시 내 정보 조회 가능", async () => {
        const password = "Password@1234";
        const passwordHashed = bcrypt.hashSync(password, 10);

        const user = await prisma.user.create({
          data: {
            email: "test2@test.com",
            password: passwordHashed,
            name: "홍길자",
            type: "BUYER",
          },
        });

        const authReq = getAuthenticatedReq(user.id);
        const response = await authReq.get("/api/users/me").send(user);
        expect(response.status).toBe(200);
        expect(response.body.email).toBe("test2@test.com");
      });
    });
  });
});

describe("내 정보 수정", () => {
  beforeAll(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("PUT /api/users/me", () => {
    beforeAll(async () => {
      await clearDatabase();
    });
    afterAll(async () => {
      await disconnectTestDB();
    });
    describe("성공", () => {
      test("내 정보 수정", async () => {
        const password = "Password@1234";
        const passwordHashed = bcrypt.hashSync(password, 10);

        const user = await prisma.user.create({
          data: {
            email: "test2@test.com",
            password: passwordHashed,
            name: "홍길자",
            type: "BUYER",
          },
        });

        const data = {
          name: "김함자",
          updatePassword: "Password!2345",
          password: password,
        };

        const authReq = getAuthenticatedReq(user.id);
        const response = await authReq.put("/api/users/me").send(data);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe("김함자");
      });
    });

    describe("실패", () => {
      test("틀린 비밀번호 입력", async () => {
        const password = "Password@1234";
        const passwordHashed = bcrypt.hashSync(password, 10);

        const user = await prisma.user.create({
          data: {
            email: "test3@test.com",
            password: passwordHashed,
            name: "홍길자",
            type: "BUYER",
          },
        });

        const data = {
          name: "김함자",
          updatePassword: "Password!2345",
          password: "password@1234~~",
        };

        const authReq = getAuthenticatedReq(user.id);
        const response = await authReq.put("/api/users/me").send(data);
        expect(response.status).toBe(401);
      });
    });
  });
});
