import express from "express";
import { getDashboard } from "../controllers/dashboardController";
import { asyncHandler } from "../middleware/asyncHandler";
import { getRecommendation } from "../services/recommendationService";

export const recommendationRouter = express.Router();

recommendationRouter.get("/:id", asyncHandler(getRecommendation));
