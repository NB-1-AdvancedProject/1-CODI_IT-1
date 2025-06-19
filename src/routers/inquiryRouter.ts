import express from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  getInquiry,
  changeInquiry,
  deleteInquiry,
  createReplies,
  patchReplies,
} from "../controllers/inquiryController";
import { authMiddleware } from "../middleware/authMiddleware";

const inquiryRouter = express.Router();

inquiryRouter.get("/", authMiddleware, asyncHandler(getInquiry));
inquiryRouter.get("/:id");
inquiryRouter.patch("/:id", authMiddleware, asyncHandler(changeInquiry));
inquiryRouter.delete("/:id", authMiddleware, asyncHandler(deleteInquiry));
inquiryRouter.post("/:id/replies", authMiddleware, asyncHandler(createReplies));
inquiryRouter.patch("/:id/replies", authMiddleware, asyncHandler(patchReplies));

export default inquiryRouter;
