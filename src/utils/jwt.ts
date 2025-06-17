import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET || "access_secret";
const REFESH_SECREST = process.env.JWT_REFESH_SECRET || "refresh_secret";

export const createAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: "1h" });
};

export const createRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, REFESH_SECREST, { expiresIn: "7d" });
};

export const verifyAccressToken = (token: string): { userId: string } => {
  return jwt.verify(token, ACCESS_SECRET) as { userId: number };
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, REFESH_SECREST) as { userId: number };
};
