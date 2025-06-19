import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  createUser,
  getUser,
  getLikeStore,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const userRouter = Router();

userRouter.post("/", asyncHandler(createUser));
userRouter.get("/me", authMiddleware, asyncHandler(getUser));
userRouter.get("/me/likes", authMiddleware, asyncHandler(getLikeStore));

export default userRouter;
