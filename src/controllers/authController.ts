import { RequestHandler } from "express";
import userService from "../services/userService";
import UnauthError from "../lib/errors/UnauthError";
import authService from "../services/authService";
import BadRequestError from "../lib/errors/BadRequestError";
import { verifyRefreshToken } from "../utils/jwt";

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.getUser(email, password);

  if (!user) {
    throw new UnauthError();
  }

  const accessToken = await authService.createToken(user, "access");
  const refreshToken = await authService.createToken(user, "refresh");

  await authService.saveToken(user.id, refreshToken);

  res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      type: user.type,
      points: user.point,
    },
    accessToken: accessToken,
  });
};

export const logout: RequestHandler = async (req, res) => {

  const userId = req.user.id;

  if (!userId) {
    throw new UnauthError();
  }

  await authService.logout(userId);

  res.status(200).json({ message: "성공적으로 로그아웃되었습니다." });
};

export const refreshToken: RequestHandler = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new BadRequestError("잘못된 요청입니다.");
  }

  const decoded = verifyRefreshToken(refreshToken);
  const update = await authService.reissueTokens(decoded.userId, refreshToken);

  res.status(200).json({
    accessToken: update.accessToken,
    refreshToken: update.refreshToken,
  });
};
