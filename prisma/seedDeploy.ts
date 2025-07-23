import prisma from "../src/lib/prisma";
import {
  GradeMocks,
  CategoryMocks,
  SizeMocks,
  StoreMocks,
  UserMocks,
  ProductMocks,
  StockMocks,
  OrderItemMocks,
  OrderMocks,
  PaymentMocks,
  CartItemMocks,
  CartMocks,
  InquiryMocks,
  ReplyMocks,
  ReviewMocks,
  FavoriteStoreMocks,
} from "./mockDeploy";

async function main() {
  await Promise.all(
    SizeMocks.map(async (mock) => {
      await prisma.size.upsert({
        where: {
          id: mock.id,
        },
        update: {},
        create: {
          ...mock,
        },
      });
    })
  );
  await Promise.all(
    GradeMocks.map(async (mock) => {
      await prisma.grade.upsert({
        where: {
          id: mock.id,
        },
        update: {},
        create: {
          ...mock,
        },
      });
    })
  );
  await Promise.all(
    CategoryMocks.map(async (mock) => {
      await prisma.category.upsert({
        where: {
          id: mock.id,
        },
        update: {},
        create: {
          ...mock,
        },
      });
    })
  );
  await Promise.all(
    UserMocks.map(async (mock) => {
      await prisma.user.upsert({
        where: {
          id: mock.id,
        },
        update: {},
        create: {
          ...mock,
        },
      });
    })
  );
  await Promise.all(
    StoreMocks.map(async (mock) => {
      await prisma.store.upsert({
        where: {
          id: mock.id,
        },
        update: {},
        create: {
          ...mock,
        },
      });
    })
  );
  await Promise.all(
    ProductMocks.map(async (mock) => {
      await prisma.product.upsert({
        where: {
          id: mock.id,
        },
        update: {},
        create: {
          ...mock,
        },
      });
    })
  );
  await Promise.all(
    StockMocks.map(async (mock) => {
      await prisma.stock.upsert({
        where: {
          id: mock.id,
        },
        update: {},
        create: {
          ...mock,
        },
      });
    })
  );
  await Promise.all(
    StockMocks.map(async (mock) => {
      await prisma.stock.upsert({
        where: {
          id: mock.id,
        },
        update: {},
        create: {
          ...mock,
        },
      });
    })
  );
  await Promise.all(
    OrderMocks.map(async (mock) => {
      await prisma.order.upsert({
        where: {
          id: mock.id,
        },
        update: {},
        create: {
          ...mock,
        },
      });
    })
  );
  await Promise.all(
    OrderItemMocks.map(async (mock) => {
      await prisma.orderItem.upsert({
        where: {
          id: mock.id,
        },
        update: {},
        create: {
          ...mock,
        },
      });
    })
  );
  await Promise.all(
    PaymentMocks.map(async (mock) => {
      await prisma.payment.upsert({
        where: {
          id: mock.id,
        },
        update: {},
        create: {
          ...mock,
        },
      });
    })
  );
  await Promise.all(
    CartMocks.map(async (mock) => {
      await prisma.cart.upsert({
        where: {
          id: mock.id,
        },
        update: {},
        create: {
          ...mock,
        },
      });
    })
  );
  await Promise.all(
    CartItemMocks.map(async (mock) => {
      await prisma.cartItem.upsert({
        where: {
          id: mock.id,
        },
        update: {},
        create: {
          ...mock,
        },
      });
    })
  );
  await Promise.all(
    InquiryMocks.map(async (mock) => {
      await prisma.inquiry.upsert({
        where: {
          id: mock.id,
        },
        update: {},
        create: {
          ...mock,
        },
      });
    })
  );
  await Promise.all(
    ReplyMocks.map(async (mock) => {
      await prisma.reply.upsert({
        where: {
          id: mock.id,
        },
        update: {},
        create: {
          ...mock,
        },
      });
    })
  );
  await Promise.all(
    ReviewMocks.map(async (mock) => {
      await prisma.review.upsert({
        where: {
          id: mock.id,
        },
        update: {},
        create: {
          ...mock,
        },
      });
    })
  );
  await Promise.all(
    FavoriteStoreMocks.map(async (mock) => {
      await prisma.favoriteStore.create({ data: { ...mock } });
    })
  );
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
