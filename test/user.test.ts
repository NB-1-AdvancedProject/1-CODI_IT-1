import request from "supertest";
import app from "../src/app";
import prisma from "../src/lib/prisma";
import bcrypt from "bcrypt";
import {
  clearDatabase,
  disconnectTestDB,
  getAuthenticatedReq,
} from "./testUtil";

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
          password: "Password!2345",
          currentPassword: password,
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
          password: "Password!2345",
          currentPassword: "password@1234~~",
        };

        const authReq = getAuthenticatedReq(user.id);
        const response = await authReq.put("/api/users/me").send(data);
        expect(response.status).toBe(401);
      });
    });
  });
});

describe("회원 탈퇴", () => {
  beforeAll(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("DELETE /api/users/delete", () => {
    beforeAll(async () => {
      await clearDatabase();
    });
    afterAll(async () => {
      await disconnectTestDB();
    });
    describe("성공", () => {
      test("회원 탈퇴", async () => {
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
        const response = await authReq.delete("/api/users/delete").send();
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "회원 탈퇴 성공" });
      });
    });
  });
});

describe("내 관심 매장 조회", () => {
  beforeAll(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/users/me/likes", () => {
    beforeAll(async () => {
      await clearDatabase();
    });
    afterAll(async () => {
      await disconnectTestDB();
    });
    describe("성공", () => {
      test("관심 목록 조회", async () => {
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

        const seller = await prisma.user.create({
          data: {
            email: "seller@test.com",
            password: passwordHashed,
            name: "남겨요",
            type: "SELLER",
          },
        });

        const store = await prisma.store.create({
          data: {
            name: "마티네 마카롱",
            address: "서울특별시 종로구 종로1가 1-1",
            phoneNumber: "02-1111-2222",
            content: "프랑스 수제 마카롱 전문점 🥐",
            image: "https://example.com/images/store1.jpg",
            userId: seller.id,
          },
        });

        const favorite = await prisma.favoriteStore.create({
          data: { userId: user.id, storeId: store.id },
        });
        const authReq = getAuthenticatedReq(user.id);
        const response = await authReq.get("/api/users/me/likes").send();
        expect(response.status).toBe(200);
        expect(response.body[0].store.name).toBe("마티네 마카롱");
      });
    });
  });
});
