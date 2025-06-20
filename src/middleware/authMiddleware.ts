import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import UnauthError from "../lib/errors/UnauthError";
import userService from "../services/userService";

const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);
    if (!token) {
      throw new UnauthError();
    }

    const { id } = verifyAccessToken(token);
    const user = await userService.getById(id);
    if (!user) {
      throw new UnauthError();
    }

    req.user = user;
    next();
  } catch {
    next(new UnauthError());
  }
};

export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return next();
    }

    const { id } = verifyAccessToken(token);
    const user = await userService.getById(id);
    if (user) {
      req.user = user;
      next();
    }
  } catch {
    next();
  }
};
