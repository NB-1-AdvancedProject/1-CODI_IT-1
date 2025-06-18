import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { createUser, getUser } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const userRouter = Router();

userRouter.post("/", asyncHandler(createUser));
userRouter.get("/me", authMiddleware, asyncHandler(getUser));

export default userRouter;
