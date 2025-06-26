import prisma from "../src/lib/prisma";
import { clearDatabase, getAuthenticatedReq, createTestUser } from "./testUtil";
import bcrypt from "bcrypt";
import { User, Product, Size } from "@prisma/client";
import { buyerUser as buyer1, sellerUser as seller1 } from "./inquiryDummy";

describe("내 주문 목록 조회", () => {
  let buyerUser: User;
  let product: Product;
  let product2: Product;
  let sellerUser: User;
  let size: Size;
  beforeAll(async () => {
    await clearDatabase();
    buyerUser = await createTestUser(buyer1);
    sellerUser = await createTestUser(seller1);
    const store = await prisma.store.create({
      data: {
        name: "테스트 상점",
        address: "서울시 강남구 테헤란로 123",
        phoneNumber: "010-1234-5678",
        content: "테스트 상점 설명",
        userId: sellerUser.id,
      },
    });
    await prisma.user.update({
      where: { id: sellerUser.id },
      data: { storeId: store.id },
    });
    const category = await prisma.category.create({
      data: {
        id: "c0fm6puffcuhepnyi73xibhcr",
        name: "테스트 카테고리",
      },
    });

    product = await prisma.product.create({
      data: {
        name: "테스트 상품",
        price: 10000,
        image: "image url",
        content: "상품 설명입니다",
        sales: 0,
        store: {
          connect: { id: store.id },
        },
        category: {
          connect: { id: category.id },
        },
      },
    });
    product2 = await prisma.product.create({
      data: {
        name: "테스트 상품2",
        price: 10000,
        image: "image url",
        content: "상품 설명입니다",
        sales: 0,
        store: {
          connect: { id: store.id },
        },
        category: {
          connect: { id: category.id },
        },
      },
    });

    size = await prisma.size.create({
      data: {
        size: "M",
      },
    });

    const stock1 = await prisma.stock.create({
      data: {
        productId: product.id,
        sizeId: size.id,
        quantity: 10,
      },
    });
    const stock2 = await prisma.stock.create({
      data: {
        productId: product2.id,
        sizeId: size.id,
        quantity: 10,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/order/", () => {
    beforeEach(async () => {
      await prisma.order.deleteMany();
    });
    test("내 오더 리스트 조회", async () => {
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

      const order1 = await prisma.order.create({
        data: {
          name: user.name,
          phone: "010-1234-5678",
          address: "서울시 강남구",
          orderItems: {create:[
            {
              productId: product.id,
              sizeId: size.id,
              quantity: 1,
            },
            { productId: product2.id, sizeId: size.id, quantity: 2 },
          ],}
          userPoint: 0,
        },
      });

      const authReq = getAuthenticatedReq(user.id);
      const response = await authReq.get("/api/order/").send();
    });
  });
});
