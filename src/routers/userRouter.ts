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

const userRouter = Router();

userRouter.post("/", asyncHandler(createUser));
userRouter.get("/me", authMiddleware, asyncHandler(getUser));
userRouter.put("/me", authMiddleware, asyncHandler(patchUser));
userRouter.delete("/delete", authMiddleware, asyncHandler(daleteUser));
userRouter.get("/me/likes", authMiddleware, asyncHandler(getLikeStore));

export default userRouter;
