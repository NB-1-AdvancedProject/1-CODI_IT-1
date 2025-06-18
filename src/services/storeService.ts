import {
  CreateStoreDTO,
  StoreResDTO,
  StoreWithFavoriteCountDTO,
} from "../lib/dto/storeDTO";

import * as storeRepository from "../repositories/storeRepository";
import UnauthError from "../lib/errors/UnauthError";
import BadRequestError from "../lib/errors/BadRequestError";
import { UserType } from "@prisma/client";
import { Store } from "../types/storeType";

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
export async function getStoreByUserId( // 현태 : 살려주세요
  userId: string
): Promise<StoreResDTO | null> {
  const store = await storeRepository.findStoreByUserId(userId);
  if (!store) {
    return null;
  }
  return new StoreResDTO(store);
}
