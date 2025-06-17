import bcrypt from "bcrypt";
import userRepository from "../repositories/userRepository";
import ForbiddenError from "../lib/errors/ForbiddenError";
import BadRequestError from "../lib/errors/BadRequestError";
import { JWT_SECRET } from "../lib/constants";
import jwt from "jsonwebtoken";
import UnauthError from "../lib/errors/UnauthError";
import Redis from "ioredis";
import { Token, TokenType } from "../types/user";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL 환경변수가 설정되지 않았습니다.");
}

const redis = new Redis(process.env.REDIS_URL);

async function verifyPassword(inputPassword: string, password: string) {
  const isMatch = await bcrypt.compare(inputPassword, password);
  if (!isMatch) {
    throw new ForbiddenError();
  }
}

async function createToken(user: Token, type: TokenType) {
  const payload = { id: user.id };
  const expiresIn = type === "refresh" ? "14d" : "1h";
  if (!JWT_SECRET) {
    throw new BadRequestError("JWT_SECRET");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

async function saveToken(userId: string, refreshToken: string) {
  return await redis.set(
    `refresh:user:${userId}`,
    refreshToken,
    "EX",
    60 * 60 * 24 * 14
  );
}

async function reissueTokens(userId: string, clientToken: string) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new UnauthError();
  }

  const storedToken = await redis.get(`refresh:user:${user.id}`);

  if (!storedToken || storedToken !== clientToken) {
    throw new UnauthError();
  }

  const accessToken = await createToken(user, "access");
  const newRefreshToken = await createToken(user, "refresh");

  await saveToken(user.id, newRefreshToken);

  return { accessToken, refreshToken: newRefreshToken };
}

async function logout(id: string) {
  return await redis.del(`refresh:user:${id}`);
}

export default {
  verifyPassword,
  createToken,
  reissueTokens,
  saveToken,
  logout,
};
