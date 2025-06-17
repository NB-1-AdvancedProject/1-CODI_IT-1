import express from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { getInquiry } from "../controllers/inquiryController";

const inquiryRouter = express.Router();

inquiryRouter.get("/", asyncHandler(getInquiry));

export default inquiryRouter;
