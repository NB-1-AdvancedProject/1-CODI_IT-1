import prisma from "../src/lib/prisma";
import {
  UserMocks,
  StoreMocks,
  ProductMocks,
  GradeMocks,
  CategoryMocks,
  SizeMocks,
  StockMocks,
  OrderMocks,
  OrderItemMocks,
  PaymentMocks,
  CartMocks,
  CartItemMocks,
  InquiryMocks,
  ReplyMocks,
  ReviewMocks,
  FavoriteStoreMocks,
} from "./mock";

async function main() {
  await prisma.grade.createMany({ data: GradeMocks });
  await prisma.category.createMany({ data: CategoryMocks });
  await prisma.size.createMany({ data: SizeMocks });
  await prisma.user.createMany({ data: UserMocks });
  await prisma.store.createMany({ data: StoreMocks });
  await prisma.product.createMany({ data: ProductMocks });
  await prisma.stock.createMany({ data: StockMocks });
  await prisma.order.createMany({ data: OrderMocks });
  await prisma.orderItem.createMany({ data: OrderItemMocks });
  await prisma.payment.createMany({ data: PaymentMocks });
  await prisma.cart.createMany({ data: CartMocks });
  await prisma.cartItem.createMany({ data: CartItemMocks });
  await prisma.inquiry.createMany({ data: InquiryMocks });
  await prisma.reply.createMany({ data: ReplyMocks });
  await prisma.review.createMany({ data: ReviewMocks });
  await prisma.favoriteStore.createMany({ data: FavoriteStoreMocks });

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
