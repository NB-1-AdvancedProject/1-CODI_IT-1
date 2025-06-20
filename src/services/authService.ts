import bcrypt from "bcrypt";
import userRepository from "../repositories/userRepository";
import ForbiddenError from "../lib/errors/ForbiddenError";
import BadRequestError from "../lib/errors/BadRequestError";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../lib/constants";
import jwt from "jsonwebtoken";
import UnauthError from "../lib/errors/UnauthError";
import { Token, TokenType } from "../types/user";
import { getRedisClient } from "../utils/redis";

async function verifyPassword(inputPassword: string, password: string) {
  const isMatch = await bcrypt.compare(inputPassword, password);
  if (!isMatch) {
    throw new ForbiddenError();
  }
}

async function createToken(user: Token, type: TokenType) {
  const secret = type === "refresh" ? JWT_REFRESH_SECRET : JWT_SECRET;
  const expiresIn = type === "refresh" ? "14d" : "1h";

  if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new BadRequestError("JWT_SECRET");
  }

  return jwt.sign({ id: user.id }, secret, { expiresIn });
}

async function saveToken(userId: string, refreshToken: string) {
  const redis = getRedisClient();
  if (!redis || !redis.isReady) {
    console.warn("Redis client not connect ed or not ready.");
    return;
  }

  const expirationInSeconds = 60 * 60 * 24 * 14;

  await redis.set(`refresh:user:${userId}`, refreshToken, {
    EX: expirationInSeconds,
  });
}

async function reissueTokens(userId: string, clientToken: string) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new UnauthError();
  }

  const storedToken = await getRedisClient()?.get(`refresh:user:${user.id}`);

  if (!storedToken || storedToken !== clientToken) {
    throw new UnauthError();
  }

  const accessToken = await createToken(user, "access");
  const newRefreshToken = await createToken(user, "refresh");

  await saveToken(user.id, newRefreshToken);

  return { accessToken, refreshToken: newRefreshToken };
}

async function logout(id: string) {
  return await getRedisClient()?.del(`refresh:user:${id}`);
}

export default {
  verifyPassword,
  createToken,
  reissueTokens,
  saveToken,
  logout,
};
