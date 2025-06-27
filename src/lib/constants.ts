import dotenv from "dotenv";
dotenv.config();

export const DATABASE_URL = process.env.DATABASE_URL;
export const PORT = process.env.PORT || 3000;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
export const REDIS_URL = process.env.REDIS_URL as string;
export const environment = process.env.NODE_ENV || "development";
export const AWS_REGION = process.env.AWS_REGION || "";
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";
export const MAX_RETRIES = 5;
export const INITIAL_BACKOFF_MS = 100;
