import { Prisma, Product } from "@prisma/client";
import prisma from "../lib/prisma";

export async function findOrderItemsByOption(
  option: Prisma.OrderItemFindManyArgs
) {
  return await prisma.orderItem.findMany({ ...option });
}

export async function getTopSales(storeId: string): Promise<Product[]> {
  return await prisma.product.findMany({
    where: { storeId },
    orderBy: { sales: "desc" },
    take: 5,
  });
}
