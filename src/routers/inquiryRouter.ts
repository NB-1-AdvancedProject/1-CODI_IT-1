import express from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  getInquiry,
  changeInquiry,
  deleteInquiry,
} from "../controllers/inquiryController";
import { authMiddleware } from "../middleware/authMiddleware";

const inquiryRouter = express.Router();

inquiryRouter.get("/", authMiddleware, asyncHandler(getInquiry));
inquiryRouter.patch("/:id", authMiddleware, asyncHandler(changeInquiry));
inquiryRouter.delete("/:id", authMiddleware, asyncHandler(deleteInquiry));

export default inquiryRouter;
