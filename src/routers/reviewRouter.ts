import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  createReview,
  deleteReview,
  getReviewInfo,
  getReviewList,
  updateReview,
} from "../controllers/reviewController";

export const reviewRouter = express.Router();
reviewRouter.post("/:id/reviews", authMiddleware, asyncHandler(createReview));
reviewRouter.get("/:id/reviews", asyncHandler(getReviewList));
reviewRouter.patch("/:id", authMiddleware, asyncHandler(updateReview));
reviewRouter.get("/:id", asyncHandler(getReviewInfo));
reviewRouter.delete("/:id", authMiddleware, asyncHandler(deleteReview));
