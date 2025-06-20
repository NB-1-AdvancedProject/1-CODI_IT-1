import {
  clearDatabase,
  disconnectTestDB,
  getAuthenticatedReq,
} from "./testUtil";
import { Product, User } from "@prisma/client";
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
import { Decimal } from "@prisma/client/runtime/library";
import app from "../src/app";
import request from "supertest";

describe("Product API 테스트", () => {
  let sellerUser1: User;
  let Product1: Product;
  beforeAll(async () => {
    await clearDatabase();
    sellerUser1 = await prisma.user.create({
      data: {
        ...sellerUser,
        password: await bcrypt.hash(sellerUser.password, 10),
      },
    });
    await prisma.store.create({ data: store1 });
    await prisma.size.create({
      data: size1,
    });
    await prisma.category.create({
      data: category1,
    });
  });
  afterAll(async () => {
    await disconnectTestDB();
  });
  beforeEach(async () => {
    await prisma.reply.deleteMany();
    await prisma.inquiry.deleteMany();
    await prisma.review.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.stock.deleteMany();
    await prisma.product.deleteMany();
    Product1 = await prisma.product.create({
      data: fullProduct,
    });
  });

  test("POST /api/products - 상품 추가", async () => {
    const newProduct = {
      name: "가디건",
      image: "https://s3-URL",
      content: "상품 상세 설명",
      price: Decimal(100),
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

    // 기본 필드
    expect(body).toHaveProperty("name");
    expect(body).toHaveProperty("content");
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("image");
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

    // reviews 배열
    expect(body).toHaveProperty("reviews");
    expect(Array.isArray(body.reviews)).toBe(true);
    if (body.reviews.length > 0) {
      const review = body.reviews[0];
      expect(review).toHaveProperty("createdAt");
      expect(review).toHaveProperty("updatedAt");
      expect(review).toHaveProperty("content");
      expect(review).toHaveProperty("rating");
      expect(review).toHaveProperty("user");
      expect(review.user).toHaveProperty("id");
      expect(review.user).toHaveProperty("username");
    }

    // inquiries 배열
    expect(body).toHaveProperty("inquiries");
    expect(Array.isArray(body.inquiries)).toBe(true);
    if (body.inquiries.length > 0) {
      const inquiry = body.inquiries[0];
      expect(inquiry).toHaveProperty("id");
      expect(inquiry).toHaveProperty("title");
      expect(inquiry).toHaveProperty("content");
      expect(inquiry).toHaveProperty("status");
      expect(inquiry).toHaveProperty("isSecret");
      expect(inquiry).toHaveProperty("createdAt");
      expect(inquiry).toHaveProperty("updatedAt");

      expect(inquiry).toHaveProperty("reply");
      expect(inquiry.reply).toHaveProperty("id");
      expect(inquiry.reply).toHaveProperty("content");
      expect(inquiry.reply).toHaveProperty("createdAt");
      expect(inquiry.reply).toHaveProperty("updatedAt");
      expect(inquiry.reply).toHaveProperty("user");
      expect(inquiry.reply.user).toHaveProperty("id");
      expect(inquiry.reply.user).toHaveProperty("name");
    }

    // category 배열
    expect(body).toHaveProperty("category");
    expect(Array.isArray(body.category)).toBe(true);
    if (body.category.length > 0) {
      const category = body.category[0];
      expect(category).toHaveProperty("id");
      expect(category).toHaveProperty("name");
    }

    // stocks 배열
    expect(body).toHaveProperty("stocks");
    expect(Array.isArray(body.stocks)).toBe(true);
    if (body.stocks.length > 0) {
      const stock = body.stocks[0];
      expect(stock).toHaveProperty("id");
      expect(stock).toHaveProperty("productId");
      expect(stock).toHaveProperty("sizeId");
      expect(stock).toHaveProperty("quantity");
    }
  });
  describe("GET /api/products - 상품 목록 조회", () => {
    let agent: ReturnType<typeof request>;
    beforeAll(async () => {
      agent = request(app);
      await prisma.user.create({ data: seller2 });
      await prisma.user.create({ data: seller3 });
      await prisma.store.create({ data: store2 });
      await prisma.store.create({ data: store3 });
      await prisma.size.create({ data: size2 });
      await prisma.size.create({ data: size3 });
      await prisma.size.create({ data: size4 });
      await prisma.category.create({ data: category2 });
      await prisma.category.create({ data: category3 });
      await prisma.product.create({ data: fullProduct2 });
      await prisma.product.create({ data: fullProduct3 });
      await prisma.product.create({ data: fullProduct4 });
      await prisma.product.create({ data: fullProduct5 });
    });

    test("기본 조회 - 페이징 기본값", async () => {
      const res = await agent.get("/api/products");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.list.products)).toBe(true);
      expect(typeof res.body.totalCount).toBe("number");
    });

    test("검색어로 이름 검색", async () => {
      const res = await agent.get("/api/products").query({
        searchBy: "name",
        search: "가디건",
      });
      expect(res.status).toBe(200);
      res.body.list.products.forEach((p: any) => {
        expect(p.name.toLowerCase()).toContain("가디건");
      });
    });

    test("검색어로 상점 이름 검색", async () => {
      const storeName = "내가 만든 상점";
      const res = await agent.get("/api/products").query({
        searchBy: "store",
        search: storeName,
      });
      expect(res.status).toBe(200);
      res.body.list.products.forEach((p: any) => {
        expect(p.storeId).toBeDefined();
      });
    });

    test("카테고리 필터링", async () => {
      const categoryName = "clothing";
      const res = await agent.get("/api/products").query({
        categoryName,
      });
      expect(res.status).toBe(200);
      res.body.list.products.forEach((p: any) => {
        expect(p.categoryId).toBeDefined();
      });
    });

    test("가격 필터링 (min, max)", async () => {
      const res = await agent.get("/api/products").query({
        priceMin: 5000,
        priceMax: 10000,
      });
      expect(res.status).toBe(200);
      res.body.list.products.forEach((p: any) => {
        expect(p.price).toBeGreaterThanOrEqual(5000);
        expect(p.price).toBeLessThanOrEqual(10000);
      });
    });

    test("사이즈 필터링", async () => {
      const size = "M";
      const res = await agent.get("/api/products").query({ size });
      expect(res.status).toBe(200);
      res.body.list.products.forEach((p: any) => {
        const hasSize = p.stocks.some((stock: any) => stock.size === size);
        expect(hasSize).toBe(true);
      });
    });

    test("좋아요 누른 상점 필터링", async () => {
      const userId = sellerUser1.id;
      const res = await agent.get("/api/products").query({
        favoriteStore: userId,
      });
      expect(res.status).toBe(200);
      res.body.list.products.forEach((p: any) => {
        expect(p.store).toBeDefined();
      });
    });

    test("정렬 조건별 조회", async () => {
      const sorts = [
        "mostReviewed",
        "highRating",
        "HighPrice",
        "lowPrice",
        "recent",
        "salesRanking",
      ];

      for (const sort of sorts) {
        const res = await agent.get("/api/products").query({ sort });
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.list.products)).toBe(true);
      }
    });

    test("페이지네이션 테스트", async () => {
      const pageSize = 2;
      const res1 = await agent
        .get("/api/products")
        .query({ page: 1, pageSize });
      const res2 = await agent
        .get("/api/products")
        .query({ page: 2, pageSize });

      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);
      expect(res1.body.list.products.length).toBeLessThanOrEqual(pageSize);
      expect(res2.body.list.products.length).toBeLessThanOrEqual(pageSize);
      // 페이지 별로 결과가 다름을 간단히 확인
      if (
        res1.body.list.products.length > 0 &&
        res2.body.list.products.length > 0
      ) {
        expect(res1.body.list.products[0].id).not.toBe(
          res2.body.list.products[0].id
        );
      }
    });
  });
  test("DELETE /api/products/:id - 상품 삭제", async () => {
    const authReq = getAuthenticatedReq(sellerUser1.id);

    const deleteResponse = await authReq.delete("/api/products/product1-id");
    expect(deleteResponse.status).toBe(204);

    // 삭제된 상품 한번더 삭제시 404 에러 발생 확인
    const Response = await authReq.delete("/api/products/product1-id");
    expect(Response.status).toBe(404);
  });
});
