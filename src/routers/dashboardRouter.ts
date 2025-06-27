import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getDashboard } from "../controllers/dashboardController";
import { asyncHandler } from "../middleware/asyncHandler";

export const dashboardRouter = express.Router();

dashboardRouter.get("/", authMiddleware, asyncHandler(getDashboard));
