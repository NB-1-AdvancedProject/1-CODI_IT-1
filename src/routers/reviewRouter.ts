import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  createReview,
  getReviewInfo,
  updateReview,
} from "../controllers/reviewController";

export const reviewRouter = express.Router();
reviewRouter.post("/:id/reviews", authMiddleware, asyncHandler(createReview));
reviewRouter.patch("/:id", authMiddleware, asyncHandler(updateReview));
reviewRouter.get("/:id", asyncHandler(getReviewInfo));
