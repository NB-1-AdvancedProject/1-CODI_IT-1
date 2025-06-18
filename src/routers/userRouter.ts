import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { createUser, getUser, patchUser } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const userRouter = Router();

userRouter.post("/", asyncHandler(createUser));
userRouter.get("/me", authMiddleware, asyncHandler(getUser));
userRouter.patch("/me", authMiddleware, asyncHandler(patchUser));

export default userRouter;
