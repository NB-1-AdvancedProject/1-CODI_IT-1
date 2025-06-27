import { Prisma } from "@prisma/client";
import stockRepository from "../repositories/stockRepository";
import prisma from "../lib/prisma";

type UpdateStockData = {
  where: Prisma.StockWhereUniqueInput;
  data: Prisma.StockUpdateInput;
};

type CreateStockData = {
  product: { connect: { id: string } };
  size: { connect: { id: string } };
  quantity: number;
};

async function createStocksForProduct(
  tx: Prisma.TransactionClient,
  stocks: { sizeId: string; quantity: number }[],
  productId: string
) {
  const stocksCreateInput: CreateStockData[] = stocks.map((stock) => ({
    product: { connect: { id: productId } },
    size: {
      connect: { id: stock.sizeId },
    },
    quantity: stock.quantity,
  }));

  return await Promise.all(
    stocksCreateInput.map((input) => stockRepository.createStockTx(tx, input))
  );
}

async function getStocksByProductId(productId: string) {
  return await stockRepository.findStocksByProductId(productId);
}

async function updateStocksForProduct(
  data: { sizeId: string; quantity: number }[],
  productId: string
) {
  const existingStocks = await getStocksByProductId(productId);
  const existingStockMap = new Map(
    existingStocks.map((stock) => [stock.sizeId, stock])
  );

  const stocksUpdateInput: UpdateStockData[] = [];
  const stocksCreateInput: CreateStockData[] = [];

  for (const stockInput of data) {
    const existing = existingStockMap.get(stockInput.sizeId);
    if (existing) {
      stocksUpdateInput.push({
        where: { id: existing.id },
        data: { quantity: stockInput.quantity },
      });
    } else {
      stocksCreateInput.push({
        product: { connect: { id: productId } },
        size: {
          connect: { id: stockInput.sizeId },
        },
        quantity: stockInput.quantity,
      });
    }
  }
  return await prisma.$transaction(async (tx) => {
    const createdStocks = await Promise.all(
      stocksCreateInput.map((input) => stockRepository.createStockTx(tx, input))
    );

    const updatedStocks = await Promise.all(
      stocksUpdateInput.map((input) => stockRepository.updateStockTx(tx, input))
    );

    return [...createdStocks, ...updatedStocks];
  });
}

export default {
  createStocksForProduct,
  getStocksByProductId,
  updateStocksForProduct,
};
