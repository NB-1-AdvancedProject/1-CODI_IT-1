import express from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  getInquiry,
  changeInquiry,
  deleteInquiry,
  createReplies,
  patchReplies,
  getDetailInquiry,
  getDetailReply,
} from "../controllers/inquiryController";
import {
  authMiddleware,
  optionalAuthMiddleware,
} from "../middleware/authMiddleware";

const inquiryRouter = express.Router();

inquiryRouter.get("/", authMiddleware, asyncHandler(getInquiry));
inquiryRouter.post("/:id/replies", authMiddleware, asyncHandler(createReplies));
inquiryRouter.patch("/:id/replies", authMiddleware, asyncHandler(patchReplies));
inquiryRouter.get(
  "/:id/replies",
  optionalAuthMiddleware,
  asyncHandler(getDetailReply)
);
inquiryRouter.get(
  "/:id",
  optionalAuthMiddleware,
  asyncHandler(getDetailInquiry)
);
inquiryRouter.patch("/:id", authMiddleware, asyncHandler(changeInquiry));
inquiryRouter.delete("/:id", authMiddleware, asyncHandler(deleteInquiry));

export default inquiryRouter;
