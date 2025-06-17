import { Response, NextFunction } from "express";
import { AuthenticatedUserRequest } from "../types/express";
import { verifyAccressToken } from "../utils/jwt";
import UnauthError from "../lib/errors/UnauthError";
import userService from "../services/userService";

export const authMiddleware = async (
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthError();
  }

  const token = authHeader?.split(" ")[1];

  try {
    const decoded = verifyAccressToken(token) as { userId: string };
    const user = await userService.getById(decoded.userId);

    if (!user) {
      throw new UnauthError();
    }

    req.user = user;
    next();
  } catch (error) {
    throw new UnauthError();
  }
};
