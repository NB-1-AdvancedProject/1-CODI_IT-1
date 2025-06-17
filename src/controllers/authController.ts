import { RequestHandler } from "express";

import userService from "../services/userService";
import UnauthError from "../lib/errors/UnauthError";
import authService from "../services/authService";

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.getUser(email, password);

  if (!user) {
    throw new UnauthError();
  }

  const accessToken = authService.createToken(user, "access");
  const refreshToken = authService.createToken(user, "refresh");

  await authService.saveToken(user.id, refreshToken);

  res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      type: user.type,
      points: user.points,
    },
    accessToken: accessToken,
  });
};
