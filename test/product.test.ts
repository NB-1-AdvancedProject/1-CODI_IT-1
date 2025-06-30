import {
  clearDatabase,
  disconnectTestDB,
  getAuthenticatedReq,
} from "./testUtil";
import { User } from "@prisma/client";
import {
  sellerUser,
  category1,
  fullProduct,
  size1,
  store1,
  fullProduct2,
  fullProduct3,
  fullProduct4,
  fullProduct5,
  size2,
  size4,
  size3,
  category2,
  category3,
  seller2,
  seller3,
  store2,
  store3,
} from "./productDummy";
import prisma from "../src/lib/prisma";
import bcrypt from "bcrypt";
import app from "../src/app";
import request from "supertest";
import uploadService from "../src/services/uploadService";

jest.mock("../src/services/uploadService", () => ({
  deleteFileFromS3: jest.fn(),
}));

describe("Product API 테스트", () => {
  let sellerUser1: User;
  beforeAll(async () => {
    await clearDatabase();
    sellerUser1 = await prisma.user.create({
      data: {
        ...sellerUser,
        password: await bcrypt.hash(sellerUser.password, 10),
      },
    });
    await prisma.user.create({
      data: {
        ...seller2,
        password: await bcrypt.hash(seller2.password, 10),
      },
    });
    await prisma.user.create({
      data: {
        ...seller3,
        password: await bcrypt.hash(seller3.password, 10),
      },
    });
    await prisma.store.create({ data: store1 });
    await prisma.store.create({ data: store2 });
    await prisma.store.create({ data: store3 });
    await prisma.size.create({ data: size1 });
    await prisma.size.create({ data: size2 });
    await prisma.size.create({ data: size3 });
    await prisma.size.create({ data: size4 });
    await prisma.category.create({ data: category1 });
    await prisma.category.create({ data: category2 });
    await prisma.category.create({ data: category3 });
    await prisma.product.create({ data: fullProduct });
    await prisma.product.create({ data: fullProduct2 });
    await prisma.product.create({ data: fullProduct3 });
    await prisma.product.create({ data: fullProduct4 });
    await prisma.product.create({ data: fullProduct5 });
  });
  afterAll(async () => {
    await disconnectTestDB();
  });

  test("POST /api/products - 상품 추가", async () => {
    const newProduct = {
      name: "가디건",
      image: "https://s3-URL",
      content: "상품 상세 설명",
      price: 100,
      categoryName: "clothing",
      stocks: [
        {
          sizeId: "size1-id",
          quantity: 10,
        },
      ],
    };
    const authReq = getAuthenticatedReq(sellerUser1.id);
    const response = await authReq.post("/api/products").send(newProduct);

    expect(response.status).toBe(201);

    const body = response.body;

    expect(body.name).toBe("가디건");
    expect(body.image).toBe("https://s3-URL");
    expect(body.content).toBe("상품 상세 설명");
    expect(body.price).toBe("100");
    expect(body).toHaveProperty("createdAt");
    expect(body).toHaveProperty("updatedAt");
    expect(body).toHaveProperty("reviewsRating");
    expect(body).toHaveProperty("storeId");
    expect(body).toHaveProperty("storeName");
    expect(body).toHaveProperty("price");
    expect(body).toHaveProperty("discountPrice");
    expect(body).toHaveProperty("discountRate");
    expect(body).toHaveProperty("discountStartTime");
    expect(body).toHaveProperty("discountEndTime");
    expect(body).toHaveProperty("reviewsCount");

    expect(body).toHaveProperty("reviews");
    expect(Array.isArray(body.reviews)).toBe(true);

    expect(body).toHaveProperty("inquiries");
    expect(Array.isArray(body.inquiries)).toBe(true);

    expect(body).toHaveProperty("category");
    expect(Array.isArray(body.category)).toBe(true);
    const category = body.category[0];
    expect(category).toHaveProperty("id");
    expect(category.name).toBe("clothing");

    expect(body).toHaveProperty("stocks");
    expect(Array.isArray(body.stocks)).toBe(true);
    const stock = body.stocks[0];
    expect(stock.sizeId).toBe("size1-id");
    expect(stock.quantity).toBe(10);

    await prisma.product.delete({
      where: {
        id: response.body.id,
      },
    });
  });
  test("GET /api/products/:id 상품 상세 조회", async () => {
    const res = await request(app).get("/api/products/product1-id");
    expect(res.body.name).toBe("가디건");
    expect(res.body.image).toBe("https://s3-url");
    expect(res.body.content).toBe("상품 상세 설명");
    expect(res.body.price).toBe("100");
    expect(res.body.createdAt).toBe("2023-01-01T00:00:00.000Z");
    expect(res.body).toHaveProperty("updatedAt");
    expect(res.body.reviewsRating).toBe(1);
    expect(res.body.storeId).toBe("store1-id");
    expect(res.body.storeName).toBe("Store1");
    expect(res.body).toHaveProperty("discountPrice");
    expect(res.body).toHaveProperty("discountRate");
    expect(res.body).toHaveProperty("discountStartTime");
    expect(res.body).toHaveProperty("discountEndTime");
    expect(res.body.reviewsCount).toBe(1);
  });
  describe("GET /api/products - 상품 목록 조회", () => {
    beforeAll(async () => {});

    test("상품 기본 조회 - 페이징 기본값", async () => {
      const res = await request(app).get("/api/products");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.list)).toBe(true);
      expect(res.body.list[0]).toHaveProperty("id");
      expect(res.body.list[0]).toHaveProperty("storeId");
      expect(res.body.list[0]).toHaveProperty("storeName");
      expect(res.body.list[0]).toHaveProperty("price");
      expect(res.body.list[0]).toHaveProperty("discountPrice");
      expect(res.body.list[0]).toHaveProperty("discountRate");
      expect(res.body.list[0]).toHaveProperty("discountStartTime");
      expect(res.body.list[0]).toHaveProperty("discountEndTime");
      expect(res.body.list[0]).toHaveProperty("reviewsCount");
      expect(res.body.list[0]).toHaveProperty("reviewsRating");
      expect(res.body.list[0]).toHaveProperty("createdAt");
      expect(res.body.list[0]).toHaveProperty("updatedAt");
      expect(res.body.list[0]).toHaveProperty("sales");
      expect(res.body.list[0]).toHaveProperty("isSoldOut");
      expect(typeof res.body.totalCount).toBe("number");
    });

    test("상품이름 기준으로 상품 검색", async () => {
      const res = await request(app).get("/api/products").query({
        searchBy: "name",
        search: "반팔",
      });
      expect(res.status).toBe(200);
      expect(res.body.list[0].name).toBe("반팔 티셔츠");
    });

    test("스토어 기준으로 상품 검색", async () => {
      const res = await request(app).get("/api/products").query({
        searchBy: "store",
        search: "2",
      });
      expect(res.status).toBe(200);
      expect(res.body.list[0].storeName).toBe("Store2");
    });

    test("카테고리 필터링", async () => {
      const res = await request(app).get("/api/products").query({
        categoryName: "생활용품",
      });
      expect(res.status).toBe(200);
      expect(res.body.list[0].name).toBe("운동화");
    });

    test("가격 필터링 (min, max)", async () => {
      const res = await request(app).get("/api/products").query({
        priceMin: 40000,
        priceMax: 50001,
      });
      expect(res.status).toBe(200);
      expect(res.body.list[0].price).toBe("50000");
    });

    //사이즈 필터링이 되는지 확인해야하는데, 요구하는 responseBody 에 사이즈 정보가없으므로 보류.

    test("정렬 조건별 조회", async () => {
      const response1 = await request(app).get("/api/products").query({
        sort: "mostReviewed",
      });
      expect(response1.status).toBe(200);
      expect(response1.body.list[0].reviewsCount).toBe(25);

      const response2 = await request(app).get("/api/products").query({
        sort: "highRating",
      });
      expect(response2.status).toBe(200);
      expect(response2.body.list[0].reviewsRating).toBe(4.9);

      const response3 = await request(app).get("/api/products").query({
        sort: "lowPrice",
      });
      expect(response3.status).toBe(200);
      expect(response3.body.list[0].price).toBe("1");

      const response4 = await request(app).get("/api/products").query({
        sort: "recent",
      });
      expect(response4.status).toBe(200);
      expect(response4.body.list[0].createdAt).toBe("2999-02-15T00:00:00.000Z");

      const response5 = await request(app).get("/api/products").query({
        sort: "salesRanking",
      });
      expect(response5.status).toBe(200);
      expect(response5.body.list[0].sales).toBe(100);
    });

    test("페이지네이션 테스트", async () => {
      const pageSize = 2;
      const res1 = await request(app)
        .get("/api/products")
        .query({ page: 1, pageSize });
      const res2 = await request(app)
        .get("/api/products")
        .query({ page: 2, pageSize });

      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);
      expect(res1.body.list.length).toBeLessThanOrEqual(pageSize);
      expect(res2.body.list.length).toBeLessThanOrEqual(pageSize);
      // 페이지 별로 결과가 다름을 간단히 확인
      if (res1.body.list.length > 0 && res2.body.list.length > 0) {
        expect(res1.body.list[0].id).not.toBe(res2.body.list[0].id);
      }
    });
  });
  describe("PATCH /products/:id - 상품 수정", () => {
    test("기본 수정 테스트", async () => {
      //uploadService.deleteFileFromS3 가 리턴하는 예시값
      (uploadService.deleteFileFromS3 as jest.Mock).mockResolvedValue({
        $metadata: {
          httpStatusCode: 204,
          requestId: "NYP3WZSRC5GP0NCE",
          extendedRequestId:
            "/KMcozw+cGAMxisc2+hN2suEl7H53DxdxAn5O6l4yaFh5WQ+BV3kOr2W2zUNA9Os4fWhubAkZqEIL2Np3oDtWMJSOzTJE9yD9SifTN9JIpc=",
          attempts: 1,
          totalRetryDelay: 0,
        },
      });

      const authReq = getAuthenticatedReq(sellerUser1.id);
      const response = await authReq.patch("/api/products/product1-id").send({
        name: "Updated Product",
        price: 19900,
        content: "Updated content",
        image: "https://example.com/image.jpg",
        discountRate: 10,
        discountStartTime: new Date(),
        discountEndTime: new Date(Date.now() + 1000 * 60 * 60 * 24),
        categoryName: "Updated Category",
        stocks: [
          { sizeId: "size1-id", quantity: 5 },
          { sizeId: "size2-id", quantity: 10 },
        ],
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe("Updated Product");
      expect(response.body.stocks.length).toBeGreaterThan(0);
      expect(uploadService.deleteFileFromS3).toHaveBeenCalled();
    });

    test("일부 필드만 수정", async () => {
      const authReq = getAuthenticatedReq(sellerUser1.id);
      const response = await authReq.patch("/api/products/product1-id").send({
        price: 29900,
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.price).toBe("29900");
    });

    test("Int 필드에 잘못된타입 삽입 테스트", async () => {
      const authReq = getAuthenticatedReq(sellerUser1.id);
      const response = await authReq.patch("/api/products/product1-id").send({
        price: "not-a-number",
      });

      expect(response.statusCode).toBe(400);
    });

    test("본인의 상품이 아닌 경우 Unauthorized(401) 반환함", async () => {
      const authReq = getAuthenticatedReq(sellerUser1.id);
      const response = await authReq.patch("/api/products/product2-id").send({
        name: "Some Name",
      });
      expect(response.status).toBe(401);
    });
    test("존재 하지않는 상품ID 를 입력했을경우 Not Found Error 반환함", async () => {
      const authReq = getAuthenticatedReq(sellerUser1.id);
      const response = await authReq
        .patch("/api/products/product10-id")
        .send({});
      expect(response.status).toBe(404);
    });
  });
  describe("DELETE /api/products/:id - 상품 삭제", () => {
    test("기본 삭제 테스트", async () => {
      //uploadService.deleteFileFromS3 가 리턴하는 예시값
      (uploadService.deleteFileFromS3 as jest.Mock).mockResolvedValue({
        $metadata: {
          httpStatusCode: 204,
          requestId: "NYP3WZSRC5GP0NCE",
          extendedRequestId:
            "/KMcozw+cGAMxisc2+hN2suEl7H53DxdxAn5O6l4yaFh5WQ+BV3kOr2W2zUNA9Os4fWhubAkZqEIL2Np3oDtWMJSOzTJE9yD9SifTN9JIpc=",
          attempts: 1,
          totalRetryDelay: 0,
        },
      });
      const authReq = getAuthenticatedReq(sellerUser1.id);

      const deleteResponse = await authReq.delete("/api/products/product1-id");
      expect(deleteResponse.status).toBe(204);

      // 삭제된 상품 한번더 삭제시 404 에러 발생 확인
      const Response = await authReq.delete("/api/products/product1-id");
      expect(Response.status).toBe(404);
    });
  });
});
