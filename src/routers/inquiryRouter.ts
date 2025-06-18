import express from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { getInquiry, changeInquiry } from "../controllers/inquiryController";
import { authMiddleware } from "../middleware/authMiddleware";

const inquiryRouter = express.Router();

inquiryRouter.get("/", authMiddleware, asyncHandler(getInquiry));
inquiryRouter.get("/:id", authMiddleware, asyncHandler(changeInquiry));

export default inquiryRouter;
