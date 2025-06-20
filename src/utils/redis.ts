
import { createClient, RedisClientType } from "redis";
import { REDIS_URL } from "../lib/constants";

let redisClient: RedisClientType | null = null;

export const connectRedis = async () => {
  if (redisClient && redisClient.isReady) {
    return redisClient;
  }

  redisClient = createClient({
    url: REDIS_URL,
  });

  try {
    await redisClient.connect();
    return redisClient;
  } catch (error) {
    redisClient = null;
    throw error;
  }
};

export const getRedisClient = () => {
  return redisClient;
};
