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
} from "./productDummy";
import prisma from "../src/lib/prisma";
import bcrypt from "bcrypt";
import { Decimal } from "@prisma/client/runtime/library";

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
  test("DELETE /api/products/:id - 상품 삭제", async () => {
    const authReq = getAuthenticatedReq(sellerUser1.id);

    const deleteResponse = await authReq.delete("/api/products/product1-id");
    expect(deleteResponse.status).toBe(204);

    // 삭제된 상품 조회 시 404 에러 발생 확인
    const findResponse = await authReq.get("/api/products/product1-id");
    expect(findResponse.status).toBe(404);
  });
});
