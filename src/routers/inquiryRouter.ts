import express from "express";
import { asyncHandler } from "../middleware/asyncHandler";

const inquiryRouter = express.Router();

inquiryRouter.post("/");

export default inquiryRouter;
