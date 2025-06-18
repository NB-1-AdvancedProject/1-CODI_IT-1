import express from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { postProduct } from "../controllers/productController";
import { authMiddleware } from "../middleware/authMiddleware";

const productRouter = express.Router();

productRouter.post("/", authMiddleware, asyncHandler(postProduct));

export default productRouter;
