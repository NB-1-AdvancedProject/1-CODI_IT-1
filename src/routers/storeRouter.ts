import express from "express";
import {
  createStore,
  deleteFavoriteStore,
  getMyStoreInfo,
  getMyStoreProductList,
  getStoreInfo,
  registerFavoriteStore,
  updateMyStore,
} from "../controllers/storeController";
import { asyncHandler } from "../middleware/asyncHandler";
import { authMiddleware } from "../middleware/authMiddleware";
import { uploadMiddleware } from "../middleware/uploadMiddleware";
import multer from "multer";

export const storeRouter = express.Router();

const upload = multer({ dest: "uploads/" }); // 또는 memoryStorage()

storeRouter.get("/detail/my", authMiddleware, asyncHandler(getMyStoreInfo));
storeRouter.get(
  "/detail/my/product",
  authMiddleware,
  asyncHandler(getMyStoreProductList)
);
storeRouter.post(
  "/:id/favorite",
  authMiddleware,
  asyncHandler(registerFavoriteStore)
);
storeRouter.delete(
  "/:id/favorite",
  authMiddleware,
  asyncHandler(deleteFavoriteStore)
);
storeRouter.get("/:id", asyncHandler(getStoreInfo));
storeRouter.patch(
  "/:id",
  authMiddleware,
  uploadMiddleware,
  asyncHandler(updateMyStore)
);
storeRouter.post(
  "/",
  authMiddleware,
  uploadMiddleware,
  asyncHandler(createStore)
);
