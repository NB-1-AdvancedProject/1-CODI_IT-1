import express from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { getInquiry } from "../controllers/inquiryController";
import { authMiddleware } from "../middleware/authMiddleware";

const inquiryRouter = express.Router();

inquiryRouter.get("/", authMiddleware, asyncHandler(getInquiry));

export default inquiryRouter;
