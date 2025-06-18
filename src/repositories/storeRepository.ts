import prisma from "../lib/prisma";
import { CreateStoreInput } from "../lib/dto/storeDTO";
import { Store } from "../types/storeType";

export async function createStore(data: CreateStoreInput): Promise<Store> {
  return await prisma.store.create({ data });
}
// 정은 Todo: 스키마에 content 추가하기..!!
export async function findStoreByUserId(userId: string): Promise<Store | null> {
  return await prisma.store.findFirst({ where: { userId } });
}
