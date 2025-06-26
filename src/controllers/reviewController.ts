import { RequestHandler } from "express";
import { assert, create } from "superstruct";
import { IdParamsStruct } from "../structs/commonStructs";
import {
  CreateReviewBodyStruct,
  UpdateReviewBodyStruct,
} from "../structs/reviewStructs";
import * as reviewService from "../services/reviewService";

export const createReview: RequestHandler = async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { id: userId } = req.user!;
  assert(req.body, CreateReviewBodyStruct);
  const result = await reviewService.createReview(req.body, userId, productId);
  res.status(201).json(result);
};

export const updateReview: RequestHandler = async (req, res) => {
  const { id: reviewId } = create(req.params, IdParamsStruct);
  const { id: userId } = req.user!;
  assert(req.body, UpdateReviewBodyStruct);
  const result = await reviewService.updateReview(req.body, userId, reviewId);
  res.status(200).json(result);
};

export const getReviewInfo: RequestHandler = async (req, res) => {
  const { id: reviewId } = create(req.params, IdParamsStruct);
  const result = await reviewService.getReviewInfo(reviewId);
  res.status(200).json(result);
};
