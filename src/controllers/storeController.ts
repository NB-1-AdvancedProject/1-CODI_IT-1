import { RequestHandler } from "express";
import * as storeService from "../services/storeService";
import {
  CreateStoreDTO,
  StoreResDTO,
  StoreWithFavoriteCountDTO,
} from "../lib/dto/storeDTO";

import { assert, create } from "superstruct";
import {
  CreateStoreBodyStruct,
  UpdateStoreBodyStruct,
} from "../structs/storeStructs";
import { IdParamsStruct, PageParamsStruct } from "../structs/commonStructs";

export const createStore: RequestHandler = async (req, res) => {
  assert(req.body, CreateStoreBodyStruct);
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

export const getMyStoreProductList: RequestHandler = async (req, res) => {
  const { id: userId } = req.user!;
  const pageParams = create(req.query, PageParamsStruct);
  const result = await storeService.getMyStoreProductList({
    userId,
    ...pageParams,
  });
  res.status(200).json(result);
};

export const getMyStoreInfo: RequestHandler = async (req, res) => {
  const { id: userId } = req.user!;
  const result = await storeService.getMyStoreInfo(userId);
  res.status(200).json(result);
};

export const updateMyStore: RequestHandler = async (req, res) => {
  const { id: userId } = req.user!;
  const { id: storeId } = create(req.params, IdParamsStruct);
  assert(req.body, UpdateStoreBodyStruct);
  const result = await storeService.updateMyStore({
    userId,
    storeId,
    ...req.body,
  });
  res.status(200).json(result);
};

export const registerFavoriteStore: RequestHandler = async (req, res) => {
  const { id: userId } = req.user!;
  const { id: storeId } = create(req.params, IdParamsStruct);
  const result = await storeService.registerFavoriteStore({ userId, storeId });
  res.status(200).json(result);
};

export const deleteFavoriteStore: RequestHandler = async (req, res) => {
  const { id: userId } = req.user!;
  const { id: storeId } = create(req.params, IdParamsStruct);
  const result = await storeService.deleteFavoriteStore({ userId, storeId });
  res.status(200).json(result);
};
