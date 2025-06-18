import { CreateStoreDTO, StoreResDTO } from "../lib/dto/storeDTO";

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
