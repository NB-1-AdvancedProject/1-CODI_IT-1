import express from "express";
import {
  createStore,
  getMyStoreInfo,
  getMyStoreProductList,
  getStoreInfo,
} from "../controllers/storeController";
import { asyncHandler } from "../middleware/asyncHandler";
import { authMiddleware } from "../middleware/authMiddleware";

export const storeRouter = express.Router();

storeRouter.post("/", authMiddleware, asyncHandler(createStore));
storeRouter.get("/:id", asyncHandler(getStoreInfo));
storeRouter.get("/detail/my", authMiddleware, asyncHandler(getMyStoreInfo));
storeRouter.get(
  "/detail/my/product",
  authMiddleware,
  asyncHandler(getMyStoreProductList)
);
