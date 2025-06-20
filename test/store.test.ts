import request from "supertest";
import app from "../src/app";
import prisma from "../src/lib/prisma";
import bcrypt from "bcrypt";
import {
  clearDatabase,
  disconnectTestDB,
  getAuthenticatedReq,
} from "./testUtil";
import {
  buyerUser as buyer1,
  buyerUser2 as buyer2,
  categories,
  product1,
  product1StocksQuantity18,
  productWithDiscount,
  product2StocksQuantity0,
  sellerUser as seller1,
  sellerUser2 as seller2,
  sizes,
  store1,
} from "./storeDummy";
import { Prisma, Product } from "@prisma/client";
import { User } from "../src/types/user";
import { Store } from "../src/types/storeType";
import { Decimal } from "@prisma/client/runtime/library";

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
    test("이미 스토어를 가지고 있을 시 AlreadyExistError(409) 발생", async () => {
      const anotherStore = {
        name: "anotherStore",
        address: "anotherAddress",
        phoneNumber: "010-0000-0000",
        content: "anotherStoreForYou",
      };
      const authReq = getAuthenticatedReq(sellerUser.id);
      const response = await authReq.post("/api/stores").send(anotherStore);
      expect(response.status).toBe(409);
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
  let buyerUser: User;
  let sellerUser: User;
  let store: Store;
  beforeAll(async () => {
    await clearDatabase();
    buyerUser = await createTestUser(buyer1);
    sellerUser = await createTestUser(seller1);
    store = await createTestStore(store1, sellerUser.id);
    await createTestFavoriteStore({ storeId: store.id, userId: buyerUser.id });
  });
  afterAll(async () => {
    await disconnectTestDB();
  });
  describe("성공", () => {
    test("기본동작: 해당 id의 store 정보와 favoriteCount 를 반환함", async () => {
      const response = await request(app).get(`/api/stores/${store.id}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(store.id);
      expect(response.body.favoriteCount).toBe(1);
    });
  });
  describe("오류", () => {
    test("CUID 형태가 아닌 스토어 아이디로 찾을 시 BadRequestError(400) 발생", async () => {
      const response = await request(app).get("/api/stores/1234");
      expect(response.status).toBe(400);
    });
    test("CUID 형태이나 존재하지 않는 스토어 요청 시 NotFoundError(404) 발생", async () => {
      const nonExistingCUID = "c00000000000000000000000";
      const response = await request(app).get(`/api/stores/${nonExistingCUID}`);
      expect(response.status).toBe(404);
    });
  });
});

describe("GET /api/stores/detail/my", () => {
  let buyerUser: User;
  let buyerUser2: User;
  let sellerUser: User;
  let sellerWithoutStore: User;
  let store: Store;
  beforeAll(async () => {
    await clearDatabase();
    buyerUser = await createTestUser(buyer1);
    buyerUser2 = await createTestUser(buyer2);
    sellerUser = await createTestUser(seller1);
    sellerWithoutStore = await createTestUser(seller2);
    await createTestCategories(categories);
    store = await createTestStore(store1, sellerUser.id);
    await prisma.product.create({ data: { storeId: store.id, ...product1 } });
    await prisma.product.create({
      data: { storeId: store.id, ...productWithDiscount },
    });
    await createTestFavoriteStore({ storeId: store.id, userId: buyerUser.id });
    await createTestFavoriteStore({
      storeId: store.id,
      userId: buyerUser2.id,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
    });
  });
  afterAll(async () => {
    await disconnectTestDB();
  });
  describe("성공", () => {
    test("기본동작: 내 스토어 정보와 favoriteCount, monthFavoriteCount, productCount를 반환함", async () => {
      const authReq = getAuthenticatedReq(sellerUser.id);
      const response = await authReq.get("/api/stores/detail/my");
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(store.id);
      expect(response.body.favoriteCount).toBe(2);
      expect(response.body.monthFavoriteCount).toBe(1);
      expect(response.body.productCount).toBe(2);
    });
  });
  describe("오류", () => {
    test("스토어가 없는 사람이라면 NotFoundError(404) 발생", async () => {
      const authReq = getAuthenticatedReq(sellerWithoutStore.id);
      const response = await authReq.get("/api/stores/detail/my");
      expect(response.status).toBe(404);
    });
    test("로그인 안했을 시 UnauthorizedError(401) 발생", async () => {
      const response = await request(app).get("/api/stores/detail/my");
      expect(response.status).toBe(401);
    });
  });
});

describe("GET /api/stores/detail/my/product", () => {
  beforeEach(async () => {
    await clearDatabase();
    await createTestCategories(categories);
    await createTestSizes(sizes);
  });
  afterAll(async () => {
    await disconnectTestDB();
  });
  describe("성공", () => {
    test("기본동작: 내 스토어의 상품목록과 totalCount를 반환함", async () => {
      const sellerWithStore = await createTestUser(seller1);
      const store = await createTestStore(store1, sellerWithStore.id);
      const product = await prisma.product.create({
        data: { storeId: store.id, ...product1 },
      });
      await createTestStocks(product1StocksQuantity18);
      const authReq = getAuthenticatedReq(sellerWithStore.id);
      const response = await authReq.get("/api/stores/detail/my/product");
      expect(response.status).toBe(200);
      expect(response.body.list[0].id).toBe(product.id);
      expect(response.body.totalCount).toBe(1);
      expect(response.body.list[0].isSoldOut).toBe(false);
      expect(response.body.list[0].isDiscount).toBe(false);
      expect(response.body.list[0].stocks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: "clxstock00cardi01" }),
          expect.objectContaining({ id: "clxstock01cardi02" }),
        ])
      );
    });
    test("기본동작: discount 중이라면 isDiscount 가 true임", async () => {
      const sellerWithStore = await createTestUser(seller1);
      const store = await createTestStore(store1, sellerWithStore.id);
      const product = await prisma.product.create({
        data: { storeId: store.id, ...productWithDiscount },
      });
      const authReq = getAuthenticatedReq(sellerWithStore.id);
      const response = await authReq.get("/api/stores/detail/my/product");
      expect(response.status).toBe(200);
      expect(response.body.list[0].id).toBe(product.id);
      expect(response.body.list[0].isDiscount).toBe(true);
    });
    test("기본동작: 재고가 총 0이라면 isSoldOut 가 true임", async () => {
      const sellerWithStore = await createTestUser(seller1);
      const store = await createTestStore(store1, sellerWithStore.id);
      const product = await prisma.product.create({
        data: { storeId: store.id, ...productWithDiscount },
      });
      await createTestStocks(product2StocksQuantity0);
      const authReq = getAuthenticatedReq(sellerWithStore.id);
      const response = await authReq.get("/api/stores/detail/my/product");
      expect(response.status).toBe(200);
      expect(response.body.list[0].id).toBe(product.id);
      expect(response.body.list[0].isSoldOut).toBe(true);
    });
    test("페이지네이션: page와 pageSize에 따라 상품 목록이 제한됨", async () => {
      const seller = await createTestUser(seller1);
      const store = await createTestStore(store1, seller.id);
      const products: Product[] = [];
      for (let i = 0; i < 5; i++) {
        const product = await prisma.product.create({
          data: {
            name: `상품${i + 1}`,
            price: new Decimal(10000),
            image: `https://example.com/image${i}.jpg`,
            content: `상품${i + 1}의 설명`,
            categoryId: "clxcat00top000001",
            storeId: store.id,
          },
        });
        products.push(product);
      }

      const authReq = getAuthenticatedReq(seller.id);

      // page 1, pageSize 3
      const resPage1 = await authReq.get(
        `/api/stores/detail/my/product?page=1&pageSize=3`
      );
      expect(resPage1.status).toBe(200);
      expect(resPage1.body.list).toHaveLength(3);
      expect(resPage1.body.totalCount).toBe(5);

      // page 2, pageSize 3 → 2개 남아 있어야 함
      const resPage2 = await authReq.get(
        `/api/stores/detail/my/product?page=2&pageSize=3`
      );
      expect(resPage2.status).toBe(200);
      expect(resPage2.body.list).toHaveLength(2);
      expect(resPage2.body.totalCount).toBe(5);
    });
  });
  describe("오류", () => {
    test("스토어가 없는 사람이라면 NotFoundError(404) 발생", async () => {
      const sellerWithoutStore = await createTestUser(seller1);
      const authReq = getAuthenticatedReq(sellerWithoutStore.id);
      const response = await authReq.get("/api/stores/detail/my/product");
      expect(response.status).toBe(404);
    });
  });
});

describe("PATCH /api/stores/:storeId", () => {
  let sellerWithStore: User;
  let sellerWithoutStore: User;
  let store: Store;
  beforeAll(async () => {
    await clearDatabase();
    sellerWithStore = await createTestUser(seller1);
    store = await createTestStore(store1, sellerWithStore.id);
    sellerWithoutStore = await createTestUser(seller2);
  });
  afterAll(async () => {
    await disconnectTestDB();
  });
  const updatedStore = {
    name: "updatedStore",
    address: "updatedAddress",
    phoneNumber: "010-0000-1234",
    content: "Newly Updated!",
  };
  describe("성공", () => {
    test("기본동작: 본인의 스토어이면 수정한 결과를 반환함", async () => {
      const authReq = getAuthenticatedReq(sellerWithStore.id);
      const response = await authReq
        .patch(`/api/stores/${store.id}`)
        .send(updatedStore);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(updatedStore);
      expect(response.body.id).toBe(store.id);
    });
  });
  describe("오류", () => {
    test("본인의 스토어가 아닌 경우 Unauthorized(401) 반환함", async () => {
      const authReq = getAuthenticatedReq(sellerWithoutStore.id);
      const response = await authReq
        .patch(`/api/stores/${store.id}`)
        .send(updatedStore);
      expect(response.status).toBe(401);
    });
  });
});
describe("POST /api/stores/:storeId/favorite", () => {
  let sellerWithStore: User;
  let store: Store;
  let buyer: User;
  beforeAll(async () => {
    await clearDatabase();
    sellerWithStore = await createTestUser(seller1);
    store = await createTestStore(store1, sellerWithStore.id);
    buyer = await createTestUser(buyer1);
  });
  afterAll(async () => {
    await disconnectTestDB();
  });
  describe("성공", () => {
    test("기본동작: favoriteStore 가 생성되고 해당 store 정보가 반환됨", async () => {
      const authReq = getAuthenticatedReq(buyer.id);
      const response = await authReq.post(`/api/stores/${store.id}/favorite`);
      expect(response.status).toBe(200);
      expect(response.body.store).toMatchObject({
        id: store.id,
        name: store.name,
        address: store.address,
        phoneNumber: store.phoneNumber,
        content: store.content,
        image: store.image,
        userId: store.userId,
      });
      expect(response.body.type).toBe("register");
    });
  });
  describe("오류", () => {
    test("이미 favorite 되어 있다면 AlreadyExtErr (409) 발생", async () => {
      const authReq = getAuthenticatedReq(buyer.id);
      const response = await authReq.post(`/api/stores/${store.id}/favorite`);
      expect(response.status).toBe(409);
    });
  });
});
describe("DELETE /api/stores/:storeId/favorite", () => {
  let sellerWithStore: User;
  let store: Store;
  let buyer: User;
  beforeAll(async () => {
    await clearDatabase();
    sellerWithStore = await createTestUser(seller1);
    store = await createTestStore(store1, sellerWithStore.id);
    buyer = await createTestUser(buyer1);
    await createTestFavoriteStore({ userId: buyer.id, storeId: store.id });
  });
  afterAll(async () => {
    await disconnectTestDB();
  });
  describe("성공", () => {
    test("기본동작: favoriteStore 가 삭제 해당 store 정보가 deleteType과 함께 반환됨", async () => {
      const authReq = getAuthenticatedReq(buyer.id);
      const response = await authReq.delete(`/api/stores/${store.id}/favorite`);
      expect(response.status).toBe(200);
      expect(response.body.store).toMatchObject({
        id: store.id,
        name: store.name,
        address: store.address,
        phoneNumber: store.phoneNumber,
        content: store.content,
        image: store.image,
        userId: store.userId,
      });
      expect(response.body.type).toBe("delete");
    });
  });
  describe("오류", () => {
    test("찜하지 않은 스토어를 삭제요청 하면 NotFoundError (404) 발생", async () => {
      const authReq = getAuthenticatedReq(buyer.id);
      const response = await authReq.delete(`/api/stores/${store.id}/favorite`);
      expect(response.status).toBe(404);
    });
  });
});

// 테스트용 함수들

export async function createTestUser(
  userData: Prisma.UserUncheckedCreateInput
) {
  const plainPassword = userData.password;
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  return prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
      type: userData.type,
    },
  });
}

export async function createTestSizes(data: Prisma.SizeCreateInput[]) {
  return prisma.size.createMany({
    data: data,
    skipDuplicates: true,
  });
}
export async function createTestCategories(data: Prisma.CategoryCreateInput[]) {
  return prisma.category.createMany({
    data: data,
    skipDuplicates: true,
  });
}

export async function createTestStore(
  storeData: Omit<Store, "id" | "userId">,
  userId: string
) {
  return prisma.store.create({
    data: {
      ...storeData,
      userId: userId,
    },
  });
}

export async function createTestFavoriteStore(data: {
  userId: string;
  storeId: string;
  createdAt?: Date;
}) {
  return prisma.favoriteStore.create({ data });
}

export async function createTestStocks(data: Prisma.StockCreateManyInput[]) {
  return prisma.stock.createMany({
    data: data,
    skipDuplicates: true,
  });
}
