import express from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { deleteProduct, postProduct } from "../controllers/productController";
import { authMiddleware } from "../middleware/authMiddleware";

const productRouter = express.Router();

productRouter.post("/", authMiddleware, asyncHandler(postProduct));
productRouter.delete("/:id", authMiddleware, asyncHandler(deleteProduct));

export default productRouter;
