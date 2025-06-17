import { Router } from "express";
import { login, logout, refreshToken } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.post("/refresh", refreshToken);

export default authRouter;
