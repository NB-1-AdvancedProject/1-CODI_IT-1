import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { postImage } from "../controllers/uploadController";
import { asyncHandler } from "../middleware/asyncHandler";
import { uploadMiddleware } from "../middleware/uploadMiddleware";

const uploadRouter = express.Router();

uploadRouter.post(
  "/upload",
  authMiddleware,
  asyncHandler(uploadMiddleware),
  asyncHandler(postImage)
);

export default uploadRouter;
