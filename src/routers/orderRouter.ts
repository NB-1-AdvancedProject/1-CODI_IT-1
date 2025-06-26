import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  createOrder,
  getOrderList,
  getOrderDetail,
} from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware";

const orderRouter = Router();

orderRouter.post("/", authMiddleware, asyncHandler(createOrder));
orderRouter.get("/", authMiddleware, asyncHandler(getOrderList));
orderRouter.get("/id", authMiddleware, asyncHandler(getOrderDetail));

export default orderRouter;
