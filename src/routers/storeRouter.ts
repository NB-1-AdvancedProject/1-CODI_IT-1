import express from "express";
import { createStore } from "../controllers/storeController";
import { asyncHandler } from "../middleware/asyncHandler";
import { authMiddleware } from "../middleware/authMiddleware";

export const storeRouter = express.Router();

// 정은 Todo: 로그인 된 것 확인하는 미들웨어 추가할 것!
storeRouter.post("/", authMiddleware, asyncHandler(createStore));
