import prisma from "../lib/prisma";
import {
  CreateStoreInput,
  FindMyStoreProductsInput,
  ProductWithStocks,
} from "../lib/dto/storeDTO";
import { Store } from "../types/storeType";

export async function createStore(data: CreateStoreInput): Promise<Store> {
  return await prisma.store.create({ data });
}

export async function findStoreByUserId(userId: string): Promise<Store | null> {
  return await prisma.store.findFirst({ where: { userId } });
}

export async function getStoreById(id: string): Promise<Store> {
  return await prisma.store.findUniqueOrThrow({ where: { id } });
}

// FavoriteStore 관련
export async function countFavoriteStoreByStoreId(
  storeId: string
): Promise<number> {
  return await prisma.favoriteStore.count({ where: { storeId } });
}

// Product 관련
export async function getProductsWithStocksByStoreId(
  data: FindMyStoreProductsInput
): Promise<ProductWithStocks[]> {
  const { storeId, page, pageSize } = data;
  return await prisma.product.findMany({
    where: { storeId },
    skip: pageSize * (page - 1),
    take: pageSize,
    include: { stocks: true },
  });
}
