import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  createUser,
  getUser,
  patchUser,
  daleteUser,
  getLikeStore,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { uploadMiddleware } from "../middleware/uploadMiddleware";

const userRouter = Router();

userRouter.post("/", asyncHandler(createUser));
userRouter.get("/me", authMiddleware, asyncHandler(getUser));
userRouter.patch(
  "/me",
  authMiddleware,
  uploadMiddleware,
  asyncHandler(patchUser)
);
userRouter.delete("/delete", authMiddleware, asyncHandler(daleteUser));
userRouter.get("/me/likes", authMiddleware, asyncHandler(getLikeStore));

export default userRouter;
