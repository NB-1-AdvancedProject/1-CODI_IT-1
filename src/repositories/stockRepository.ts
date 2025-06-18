import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";

async function createStocks(datas: Prisma.StockCreateInput[]) {
  return await prisma.$transaction(async (tx) => {
    const stocks = await Promise.all(
      datas.map(async (item) => {
        return await tx.stock.create({
          data: item,
          include: {
            size: true,
          },
        });
      })
    );
    return stocks;
  });
}

export default {
  createStocks,
};
