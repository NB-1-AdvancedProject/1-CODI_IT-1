import prisma from "../lib/prisma";
import { CreateStoreInput } from "../lib/dto/storeDTO";
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

// Product 관련
export async function countProductByStoreId(storeId: string): Promise<number> {
  return await prisma.product.count({ where: { storeId } });
}

// FavoriteStore 관련
export async function countFavoriteStoreByStoreId(
  storeId: string
): Promise<number> {
  return await prisma.favoriteStore.count({ where: { storeId } });
}

export async function countMonthFavoriteStore(
  storeId: string
): Promise<number> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return await prisma.favoriteStore.count({
    where: { AND: [{ storeId }, { createdAt: { gte: thirtyDaysAgo } }] },
  });
}
