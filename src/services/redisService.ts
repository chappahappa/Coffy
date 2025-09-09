
import Redis from "ioredis";
import { config } from "../config/index.js";


const redis = new Redis.default(config.REDIS_URL);

class RedisService {
  private MESSAGE_LIMIT = 20;

  async addMessage(userId: string, role: "user" | "assistant", content: string) {
    const key = `chat:${userId}`;
    await redis.rpush(key, JSON.stringify({ role, content }));

    await redis.ltrim(key, -this.MESSAGE_LIMIT, -1);
  }

  async getMessages(userId: string) {
    const key = `chat:${userId}`;
    const rawMessages = await redis.lrange(key, 0, -1);
    return rawMessages.map((msg) => JSON.parse(msg));
  }

  async clearMessages(userId: string) {
    const key = `chat:${userId}`;
    await redis.del(key);
  }
}

export const redisService = new RedisService();