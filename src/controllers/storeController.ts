import { RequestHandler } from "express";
import * as storeService from "../services/storeService";
import {
  CreateStoreDTO,
  StoreResDTO,
  StoreWithFavoriteCountDTO,
} from "../lib/dto/storeDTO";

import { assert, create } from "superstruct";
import { createStoreBodyStruct } from "../structs/storeStructs";
import { IdParamsStruct } from "../structs/commonStructs";

export const createStore: RequestHandler = async (req, res) => {
  assert(req.body, createStoreBodyStruct);
  const dto: CreateStoreDTO = {
    userId: req.user!.id,
    userType: req.user!.type,
    ...req.body,
  };
  const result: StoreResDTO = await storeService.createStore(dto);
  res.status(201).json(result);
};

export const getStoreInfo: RequestHandler = async (req, res) => {
  const { id: storeId } = create(req.params, IdParamsStruct);
  const result: StoreWithFavoriteCountDTO = await storeService.getStoreInfo(
    storeId
  );
  res.status(200).json(result);
};
