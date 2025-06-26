import prisma from "../src/lib/prisma";
import { clearDatabase, getAuthenticatedReq, createTestUser } from "./testUtil";
import { User, Product, Size } from "@prisma/client";
import { buyerUser as buyer1, sellerUser as seller1 } from "./inquiryDummy";

describe("Order API", () => {
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
        quantity: 100,
      },
    });
    const stock2 = await prisma.stock.create({
      data: {
        productId: product2.id,
        sizeId: size.id,
        quantity: 100,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/order/", () => {
    beforeEach(async () => {
      await prisma.order.deleteMany();
    });
    test("오더 생성", async () => {
      const updatePoint = await prisma.user.update({
        where: { id: buyerUser.id },
        data: {
          point: 3000,
        },
      });

      const order = {
        name: "김유저",
        phone: "010-1234-1234",
        address: "서울시 강남구 대치동",
        orderItems: [
          {
            productId: product.id,
            sizeId: size.id,
            quantity: 1,
          },
        ],
        usePoint: 1000,
      };

      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq.post("/api/order/").send(order);

      expect(response.statusCode).toBe(201);
      expect(response.body.payments.status).toBe("CompletedPayment");
    });
    test("포인트 부족으로 인한 실패", async () => {
      const order = {
        name: "김유저",
        phone: "010-1234-1234",
        address: "서울시 강남구 대치동",
        orderItems: [
          {
            productId: product.id,
            sizeId: size.id,
            quantity: 1,
          },
        ],
        usePoint: 5000,
      };

      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq.post("/api/order").send(order);

      expect(response.statusCode).toBe(400);
    });
    test("재고 수량 부족으로 인한 실패", async () => {
      const order = {
        name: "김유저",
        phone: "010-1234-1234",
        address: "서울시 강남구 대치동",
        orderItems: [
          {
            productId: product.id,
            sizeId: size.id,
            quantity: 101,
          },
        ],
        usePoint: 0,
      };

      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq.post("/api/order").send(order);

      expect(response.statusCode).toBe(400);
    });
  });

  describe("GET /api/order/", () => {
    beforeEach(async () => {
      await prisma.order.deleteMany();
    });
    test("내 오더 리스트 조회", async () => {
      const order1 = {
        name: "김유저",
        phone: "010-1234-1234",
        address: "서울시 강남구 대치동",
        orderItems: [
          {
            productId: product.id,
            sizeId: size.id,
            quantity: 1,
          },
        ],
        usePoint: 0,
      };

      const order2 = {
        name: "김유저2",
        phone: "010-1234-1234",
        address: "서울시 강남구 대치동",
        orderItems: [
          {
            productId: product2.id,
            sizeId: size.id,
            quantity: 2,
          },
          {
            productId: product.id,
            sizeId: size.id,
            quantity: 1,
          },
        ],
        usePoint: 0,
      };

      const authReq = getAuthenticatedReq(buyerUser.id);
      const res1 = await authReq.post("/api/order").send(order1);
      expect(res1.status).toBe(201);
      const res2 = await authReq.post("/api/order").send(order2);
      expect(res2.status).toBe(201);
      const response = await authReq.get("/api/order?status=PAID").send();

      expect(response.status).toBe(200);
      expect(response.body[1].orderItems[1].product.name).toBe("테스트 상품2");
    });
  });

  describe("GET /api/order/:orderId", () => {
    beforeEach(async () => {
      await prisma.order.deleteMany();
    });
    test("오더 상세 조회", async () => {
      const order1 = {
        name: "김유저",
        phone: "010-1234-1234",
        address: "서울시 강남구 대치동",
        orderItems: [
          {
            productId: product.id,
            sizeId: size.id,
            quantity: 1,
          },
        ],
        usePoint: 0,
      };

      const authReq = getAuthenticatedReq(buyerUser.id);
      const res1 = await authReq.post("/api/order").send(order1);
      expect(res1.status).toBe(201);
      const response = await authReq.get(`/api/order/${res1.body.id}`).send();

      expect(response.status).toBe(200);
      expect(response.body.orderItems[0].product.name).toBe("테스트 상품");
    });
    test("실패 - 다른 사람의 오더 정보를 불러옴", async () => {
      const order1 = {
        name: "김유저",
        phone: "010-1234-1234",
        address: "서울시 강남구 대치동",
        orderItems: [
          {
            productId: product.id,
            sizeId: size.id,
            quantity: 1,
          },
        ],
        usePoint: 0,
      };

      const order2 = {
        name: "김한돌",
        phone: "010-2345-6789",
        address: "서울시 대충구 대강동",
        orderItems: [
          {
            productId: product.id,
            sizeId: size.id,
            quantity: 1,
          },
        ],
        usePoint: 0,
      };

      const authReq1 = getAuthenticatedReq(sellerUser.id);
      const res1 = await authReq1.post("/api/order").send(order1);
      expect(res1.status).toBe(201);

      const authReq2 = getAuthenticatedReq(buyerUser.id);
      const res2 = await authReq2.post("/api/order").send(order2);
      expect(res2.status).toBe(201);
      const response = await authReq2.get(`/api/order/${res1.body.id}`).send();

      expect(response.status).toBe(403);
    });
    test("실패 - orderId 틀림", async () => {
      const order1 = {
        name: "김유저",
        phone: "010-1234-1234",
        address: "서울시 강남구 대치동",
        orderItems: [
          {
            productId: product.id,
            sizeId: size.id,
            quantity: 1,
          },
        ],
        usePoint: 0,
      };

      const authReq = getAuthenticatedReq(sellerUser.id);
      const res1 = await authReq.post("/api/order").send(order1);
      expect(res1.status).toBe(201);
      const response = await authReq
        .get(`/api/order/cmcd0i9l4000pdvfhjo2ax0sn`)
        .send();

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/order/:id", () => {
    beforeEach(async () => {
      await prisma.order.deleteMany();
    });

    test("주문 대기시 삭제 성공", async () => {
      const order = await prisma.order.create({
        data: {
          userId: buyerUser.id,
          name: buyerUser.name,
          phone: "010-1234-1234",
          address: "서울시 강남구 대치동",
          status: "PENDING",
          subtotal: product.price,
          orderItems: {
            create: [
              {
                productId: product.id,
                sizeId: size.id,
                quantity: 1,
                price: product.price,
              },
            ],
          },
          usePoint: 0,
          payment: {
            create: {
              status: "CompletedPayment",
              totalPrice: product.price,
            },
          },
          paidAt: new Date(),
        },
      });

      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq.delete(`/api/order/${order.id}`).send();
      expect(response.status).toBe(201);
    });

    test("paid 상태시 삭제 불가", async () => {
      const order = {
        name: "김한돌",
        phone: "010-2345-6789",
        address: "서울시 대충구 대강동",
        orderItems: [
          {
            productId: product.id,
            sizeId: size.id,
            quantity: 1,
          },
        ],
        usePoint: 0,
      };

      const authReq = getAuthenticatedReq(buyerUser.id);
      const res1 = await authReq.post("/api/order").send(order);
      expect(res1.status).toBe(201);
      const response = await authReq
        .delete(`/api/order/${res1.body.id}`)
        .send();
      expect(response.status).toBe(400);
    });

    test("다른 사용자의 오더를 삭제", async () => {
      const order = {
        name: "김한돌",
        phone: "010-2345-6789",
        address: "서울시 대충구 대강동",
        orderItems: [
          {
            productId: product.id,
            sizeId: size.id,
            quantity: 1,
          },
        ],
        usePoint: 0,
      };

      const authReq = getAuthenticatedReq(buyerUser.id);
      const authReq2 = getAuthenticatedReq(sellerUser.id);
      const res1 = await authReq.post("/api/order").send(order);
      expect(res1.status).toBe(201);
      const response = await authReq2
        .delete(`/api/order/${res1.body.id}`)
        .send();
      expect(response.status).toBe(403);
    });

    test("잘못된 id 입력", async () => {
      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq
        .delete("/api/order/cmcd0i9l4000pdvfhjo2ax0sn")
        .send();
      expect(response.status).toBe(404);
    });
  });
  describe("PATCH /api/order/:orderId", () => {
    beforeEach(async () => {
      await prisma.order.deleteMany();
    });
    test("오더 수정", async () => {
      const order1 = {
        name: "김유저",
        phone: "010-1234-1234",
        address: "서울시 강남구 대치동",
        orderItems: [
          {
            productId: product.id,
            sizeId: size.id,
            quantity: 1,
          },
        ],
        usePoint: 0,
      };

      const data = {
        name: "강남자",
        phone: "010-3456-1234",
        address: "경기도 상황리 은근읍",
      };

      const authReq = getAuthenticatedReq(buyerUser.id);
      const res1 = await authReq.post("/api/order").send(order1);
      expect(res1.status).toBe(201);
      const response = await authReq
        .patch(`/api/order/${res1.body.id}`)
        .send(data);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe("강남자");
      expect(response.body.phoneNumber).toBe("010-3456-1234");
      expect(response.body.address).toBe("경기도 상황리 은근읍");
      expect(response.body).toHaveProperty("subtotal");
    });

    test("DELIVERED 상태시 수정 불가", async () => {
      const order = await prisma.order.create({
        data: {
          userId: buyerUser.id,
          name: buyerUser.name,
          phone: "010-1234-1234",
          address: "서울시 강남구 대치동",
          status: "DELIVERED",
          subtotal: product.price,
          orderItems: {
            create: [
              {
                productId: product.id,
                sizeId: size.id,
                quantity: 1,
                price: product.price,
              },
            ],
          },
          usePoint: 0,
          payment: {
            create: {
              status: "CompletedPayment",
              totalPrice: product.price,
            },
          },
          paidAt: new Date(),
        },
      });

      const data = {
        name: "강남자",
        phone: "010-3456-1234",
        address: "경기도 상황리 은근읍",
      };

      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq.patch(`/api/order/${order.id}`).send(data);
      expect(response.status).toBe(400);
    });

    test("다른 사용자의 오더를 수정", async () => {
      const order = {
        name: "김한돌",
        phone: "010-2345-6789",
        address: "서울시 대충구 대강동",
        orderItems: [
          {
            productId: product.id,
            sizeId: size.id,
            quantity: 1,
          },
        ],
        usePoint: 0,
      };

      const data = {
        name: "강남자",
        phone: "010-3456-1234",
        address: "경기도 상황리 은근읍",
      };

      const authReq = getAuthenticatedReq(buyerUser.id);
      const authReq2 = getAuthenticatedReq(sellerUser.id);
      const res1 = await authReq.post("/api/order").send(order);
      expect(res1.status).toBe(201);
      const response = await authReq2
        .patch(`/api/order/${res1.body.id}`)
        .send(data);
      expect(response.status).toBe(403);
    });

    test("잘못된 id 입력", async () => {
      const data = {
        name: "강남자",
        phone: "010-3456-1234",
        address: "경기도 상황리 은근읍",
      };

      const authReq = getAuthenticatedReq(buyerUser.id);
      const response = await authReq
        .patch("/api/order/cmcd0i9l4000pdvfhjo2ax0sn")
        .send(data);
      expect(response.status).toBe(404);
    });
  });
});
