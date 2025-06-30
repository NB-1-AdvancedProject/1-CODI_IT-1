import { RequestHandler } from "express";
import { assert, create } from "superstruct";
import { IdParamsStruct } from "../structs/commonStructs";
import {
  CreateReviewBodyStruct,
  GetReviewListPageParamsStruct,
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

export const deleteReview: RequestHandler = async (req, res) => {
  const { id: reviewId } = create(req.params, IdParamsStruct);
  const { id: userId } = req.user!;
  await reviewService.deleteReview(reviewId, userId);
  res.status(200).json({ message: "리뷰를 삭제했습니다." }); // 정은: swagger 대로 만들었는데, 나중에 수정해야할 듯
};

export const getReviewList: RequestHandler = async (req, res) => {
  const { id: productId } = create(req.params, IdParamsStruct);
  const params = create(req.query, GetReviewListPageParamsStruct);
  const result = await reviewService.getReviewList(productId, params);
  res.status(200).json(result);
};
