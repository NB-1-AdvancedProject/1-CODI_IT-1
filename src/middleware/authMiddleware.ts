import { Response, NextFunction } from "express";
import { AuthenticatedUserRequest } from "../typings/express";
import { verifyAccressToken } from "../utils/jwt";

import BadRequestError from "../lib/errors/BadRequestError";
import userRepository from "../repositories/userRepository";

export const authMiddleware = async (
  req: AuthenticatedUserRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(401).json({ message: "인증 토큰이 없습니다." });
    return;
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
    throw new BadRequestError("유효하지 않은 토큰 입니다.");
  }
};
