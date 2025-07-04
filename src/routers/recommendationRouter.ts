import express from "express";
import { getDashboard } from "../controllers/dashboardController";
import { asyncHandler } from "../middleware/asyncHandler";

export const recommendationRouter = express.Router();

recommendationRouter.get("/:id", asyncHandler(getRecommendation));
