import { Router } from "express";
import { login, logout, refreshToken } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";
import { asyncHandler } from "../middleware/asyncHandler";
import passport from "passport";

const authRouter = Router();

authRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
authRouter.get("/auth/google/callback", passport.authenticate("google"));
authRouter.post("/login", asyncHandler(login));
authRouter.post("/logout", authMiddleware, asyncHandler(logout));
authRouter.post("/refresh", asyncHandler(refreshToken));

export default authRouter;
