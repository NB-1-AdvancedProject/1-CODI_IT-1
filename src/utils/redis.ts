import { createClient, RedisClientType } from "redis";
import { REDIS_URL } from "../lib/constants";

let clientInstance: RedisClientType | null = null;

export const connectRedis = async (): Promise<RedisClientType> => {
  if (clientInstance && clientInstance.isReady) {
    return clientInstance;
  }

  if (!REDIS_URL) {
    throw new Error(
      "REDIS_URL is missing. Please set it in your environment variables."
    );
  }

  clientInstance = createClient({
    url: REDIS_URL,
  });

  try {
    await clientInstance.connect();
    return clientInstance;
  } catch (error) {
    clientInstance = null;
    throw error;
  }
};

export const getRedisClient = (): RedisClientType | null => {
  return clientInstance;
};
