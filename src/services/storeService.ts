import {
  CreateStoreDTO,
  MyStoreDTO,
  StoreResDTO,
  StoreWithFavoriteCountDTO,
} from "../lib/dto/storeDTO";

import * as storeRepository from "../repositories/storeRepository";
import UnauthError from "../lib/errors/UnauthError";
import BadRequestError from "../lib/errors/BadRequestError";
import { UserType } from "@prisma/client";
import { Store } from "../types/storeType";
import NotFoundError from "../lib/errors/NotFoundError";

export async function createStore(dto: CreateStoreDTO): Promise<StoreResDTO> {
  const { userType, ...storeData } = dto;
  if (userType !== UserType.SELLER) {
    throw new UnauthError(); // 정은 : 이 에러가 최선인가..
  }
  const existingStore = await storeRepository.findStoreByUserId(dto.userId);
  if (existingStore) {
    throw new BadRequestError("You alreadly have a store"); // 정은 : 이 에러가 최선인가..
  }

  const store: Store = await storeRepository.createStore(storeData);
  return new StoreResDTO(store);
}

export async function getStoreInfo(
  storeId: string
): Promise<StoreWithFavoriteCountDTO> {
  const store = await storeRepository.getStoreById(storeId);
  const favoriteCount = await storeRepository.countFavoriteStoreByStoreId(
    storeId
  );
  return new StoreWithFavoriteCountDTO(store, favoriteCount);
}
export async function getStoreByUserId(
  userId: string
): Promise<StoreResDTO | null> {
  const store = await storeRepository.findStoreByUserId(userId);
  if (!store) {
    return null;
  }
  return new StoreResDTO(store);
}

export async function getMyStoreInfo(userId: string): Promise<MyStoreDTO> {
  const store = await storeRepository.findStoreByUserId(userId);
  if (!store) {
    throw new NotFoundError("store", `userId: ${userId}`);
  }
  const productCount = await storeRepository.countProductByStoreId(store.id); // 정은 Todo: productRepo 랑 겹치는 경우 합칠 예정
  const monthFavoriteCount = await storeRepository.countMonthFavoriteStore(
    // 정은 Todo: FavoriteStoreRepo를 따로 팔지 고민해보자
    store.id
  );
  const favoriteCount = await storeRepository.countFavoriteStoreByStoreId(
    store.id
  );
  return new MyStoreDTO(store, favoriteCount, productCount, monthFavoriteCount);
}
