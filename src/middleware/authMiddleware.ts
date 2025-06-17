import { Response, NextFunction } from "express";
import { AuthenticatedUserRequest } from "../types/express";
import { verifyAccressToken } from "../utils/jwt";
import userRepository from "../repositories/userRepository";
import UnauthError from "../lib/errors/UnauthError";

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
    const user = await userRepository.getById(decoded.userId);

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    next();
  } catch (error) {
    throw new UnauthError();
  }
};
