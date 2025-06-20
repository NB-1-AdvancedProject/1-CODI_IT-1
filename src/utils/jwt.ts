import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_REFRESH_SECRET } from "../lib/constants";

export interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

export const createAccessToken = (userId: string): string => {
  return jwt.sign({ id: userId } as JwtPayload, JWT_SECRET, {
    expiresIn: "1h",
  });
};

export const createRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId } as JwtPayload, JWT_REFRESH_SECRET, {
    expiresIn: "14d",
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
};
