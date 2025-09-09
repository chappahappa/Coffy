import Redis from "ioredis";
import { config } from "../config/index.js";


const redisClient = new Redis.default(config.REDIS_URL)
class AnalyticsService {
  async logMessage(userId: number) {
    await redisClient.hincrby(`stats:${userId}`, "messagesCount", 1);
  }

  async getUserStats(userId: number) {
    const data = await redisClient.hgetall(`stats:${userId}`);
    return {
      messagesCount: parseInt(data.messagesCount || "0", 10)
    };
  }
}

export const analyticsService = new AnalyticsService();