import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  postCartData,
  getCartItemList,
  patchCartData,
} from "../controllers/cartController";

const cartRouter = Router();

cartRouter.post("/", authMiddleware, asyncHandler(postCartData));
cartRouter.get("/", authMiddleware, asyncHandler(getCartItemList));
cartRouter.patch("/", authMiddleware, asyncHandler(patchCartData));

export default cartRouter;
