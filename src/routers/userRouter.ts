import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { createUser } from "../controllers/userController";

const userRouter = Router();

userRouter.post("/", asyncHandler(createUser));

export default userRouter;
