import request from "supertest";
import app from "../src/app";
import prisma from "../src/lib/prisma";
import bcrypt from "bcrypt";
import { clearDatabase } from "./testUtil";

describe("유저 생성 기능", () => {
  beforeAll(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
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
