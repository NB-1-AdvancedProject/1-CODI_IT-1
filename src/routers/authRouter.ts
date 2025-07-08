import { Router } from "express";
import {
  login,
  logout,
  oauthLogin,
  refreshToken,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";
import { asyncHandler } from "../middleware/asyncHandler";
import passport from "../lib/passport";

const authRouter = Router();

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "#!/login",
    session: false,
  }),
  oauthLogin
);
authRouter.get(
  "/kakao",
  passport.authenticate("kakao", { failureRedirect: "#!/login" })
);
authRouter.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "#!/login",
    session: false,
  }),
  oauthLogin
);

authRouter.get(
  "/naver",
  passport.authenticate("naver", { failureRedirect: "#!/login" })
);
authRouter.get(
  "/naver/callback",
  passport.authenticate("naver", {
    failureRedirect: "#!/login",
    session: false,
  }),
  oauthLogin
);
authRouter.post("/login", asyncHandler(login));
authRouter.post("/logout", authMiddleware, asyncHandler(logout));
authRouter.post("/refresh", asyncHandler(refreshToken));

export default authRouter;
