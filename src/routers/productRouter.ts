import express from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { postProduct } from "../controllers/productController";

const productRouter = express.Router();

productRouter.post("/", asyncHandler(postProduct));

export default productRouter;
