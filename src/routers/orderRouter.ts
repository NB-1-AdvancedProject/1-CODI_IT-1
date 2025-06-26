import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { createOrder, getOrderList } from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware";

const orderRouter = Router();

orderRouter.post("/", authMiddleware, asyncHandler(createOrder));
orderRouter.get("/", authMiddleware, asyncHandler(getOrderList));

export default orderRouter;
