import request from "supertest";
import app from "../src/app";
import prisma from "../src/lib/prisma";
import {
  clearDatabase,
  createTestUser,
  disconnectTestDB,
  getAuthenticatedReq,
} from "./testUtil";
import {
  buyerUser as buyer1,
  sellerUser as seller1,
  sellerUser2 as seller2,
} from "./storeDummy";
import { User } from "@prisma/client";

describe("POST /api/stores", () => {
  let buyerUser: User;
  let sellerUser: User;
  let sellerUser2: User;
  beforeAll(async () => {
    await clearDatabase();
    buyerUser = await createTestUser(buyer1);
    sellerUser = await createTestUser(seller1);
    sellerUser2 = await createTestUser(seller2);
  });
  afterAll(async () => {
    await disconnectTestDB();
  });
  describe("성공", () => {
    test("기본동작: seller 로 로그인 시 생성 가능함", async () => {
      const newStore = {
        name: "newStore",
        address: "newAddress",
        phoneNumber: "010-0000-0000",
        content: "newStoreForYou",
      };
      const authReq = getAuthenticatedReq(sellerUser.id);
      const response = await authReq.post("/api/stores").send(newStore);
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(newStore);
    });
  });
  describe("오류", () => {
    test("buyer 로 로그인 시 UnauthError(401) 발생", async () => {
      const newStore = {
        name: "newStore",
        address: "newAddress",
        phoneNumber: "010-0000-0000",
        content: "newStoreForYou",
      };
      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq.post("/api/stores").send(newStore);
      expect(response.status).toBe(401);
    });
    test("이미 스토어를 가지고 있을 시 BadRequestError(400) 발생", async () => {
      const anotherStore = {
        name: "anotherStore",
        address: "anotherAddress",
        phoneNumber: "010-0000-0000",
        content: "anotherStoreForYou",
      };
      const authReq = getAuthenticatedReq(sellerUser.id); // 앞서 이미 newStore 가지고 있음
      const response = await authReq.post("/api/stores").send(anotherStore);
      expect(response.status).toBe(400);
    });
    test("입력값이 맞지 않을 시 BadRequestError(400) 발생", async () => {
      const wrongStore = {
        name: "wrongStore",
      };
      const authReq = getAuthenticatedReq(sellerUser2.id);
      const response = await authReq.post("/api/stores").send(wrongStore);
      expect(response.status).toBe(400);
    });
  });
});

describe("GET /api/stores/:id", () => {
  beforeAll(async () => {
    await clearDatabase();
  });
  afterAll(async () => {
    await disconnectTestDB();
  });
  describe("성공", () => {
    test("기본동작: 해당 id의 store 정보와 favoriteCount 를 반환함", async () => {
      const newStore = {
        name: "newStore",
        address: "newAddress",
        phoneNumber: "010-0000-0000",
        content: "newStoreForYou",
      };
      const authReq = getAuthenticatedReq(sellerUser.id);
      const response = await authReq.post("/api/stores").send(newStore);
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(newStore);
    });
  });
  describe("오류", () => {
    test("buyer 로 로그인 시 UnauthError(401) 발생", async () => {
      const newStore = {
        name: "newStore",
        address: "newAddress",
        phoneNumber: "010-0000-0000",
        content: "newStoreForYou",
      };
      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq.post("/api/stores").send(newStore);
      expect(response.status).toBe(401);
    });
    test("이미 스토어를 가지고 있을 시 BadRequestError(400) 발생", async () => {
      const anotherStore = {
        name: "anotherStore",
        address: "anotherAddress",
        phoneNumber: "010-0000-0000",
        content: "anotherStoreForYou",
      };
      const authReq = getAuthenticatedReq(sellerUser.id); // 앞서 이미 newStore 가지고 있음
      const response = await authReq.post("/api/stores").send(anotherStore);
      expect(response.status).toBe(400);
    });
    test("입력값이 맞지 않을 시 BadRequestError(400) 발생", async () => {
      const wrongStore = {
        name: "wrongStore",
      };
      const authReq = getAuthenticatedReq(sellerUser2.id);
      const response = await authReq.post("/api/stores").send(wrongStore);
      expect(response.status).toBe(400);
    });
  });
});
