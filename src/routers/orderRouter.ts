import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  createOrder,
  getOrderList,
  getOrderDetail,
  deleteOrder,
  patchOrder
} from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware";

const orderRouter = Router();

orderRouter.post("/", authMiddleware, asyncHandler(createOrder));
orderRouter.get("/", authMiddleware, asyncHandler(getOrderList));
orderRouter.get("/:id", authMiddleware, asyncHandler(getOrderDetail));
orderRouter.delete("/:id", authMiddleware, asyncHandler(deleteOrder));
orderRouter.patch("/:id", authMiddleware, asyncHandler(patchOrder));

export default orderRouter;
