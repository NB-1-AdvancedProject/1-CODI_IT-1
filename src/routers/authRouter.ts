import { Router } from "express";
import { login, logout, refreshToken } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";
import { asyncHandler } from "../middleware/asyncHandler";

const authRouter = Router();

authRouter.post("/login", asyncHandler(login));
authRouter.post("/logout", authMiddleware, asyncHandler(logout));
authRouter.post("/refresh", asyncHandler(refreshToken));

export default authRouter;
