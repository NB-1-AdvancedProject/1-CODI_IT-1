import { Router } from "express";
import { login, logout, refreshToken } from "../controllers/authController";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/refresh", refreshToken);

export default authRouter;
