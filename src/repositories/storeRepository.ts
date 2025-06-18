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

export async function countFavoriteStoreByStoreId(
  storeId: string
): Promise<number> {
  return await prisma.favoriteStore.count({ where: { storeId } });
}
