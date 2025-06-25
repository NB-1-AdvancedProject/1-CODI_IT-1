import express from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  deleteProduct,
  getProduct,
  getProducts,
  patchProduct,
  postProduct,
} from "../controllers/productController";
import { authMiddleware } from "../middleware/authMiddleware";
import { postQuiryData, getQuiryList } from "../controllers/inquiryController";
import { createReview } from "../controllers/reviewController";

const productRouter = express.Router();

productRouter.get("/:id", asyncHandler(getProduct));
productRouter.get("/", asyncHandler(getProducts));
productRouter.post("/", authMiddleware, asyncHandler(postProduct));
productRouter.patch("/:id", authMiddleware, asyncHandler(patchProduct));
productRouter.delete("/:id", authMiddleware, asyncHandler(deleteProduct));
productRouter.post(
  "/:id/inquiries",
  authMiddleware,
  asyncHandler(postQuiryData)
);
productRouter.get("/:id/inquiries", asyncHandler(getQuiryList));

export default productRouter;
