import type { Middleware } from "grammy";

const userTimestamps = new Map<number, number>();

export const rateLimitMiddleware: Middleware<any> = async (ctx, next) => {
  const userId = ctx.from?.id;
  if (!userId) return next();

  const lastTime = userTimestamps.get(userId) || 0;
  const now = Date.now();

  if (now - lastTime < 1000) { // 1 секунда между сообщениями
    await ctx.reply("Please no spam! :)");
    return;
  }

  userTimestamps.set(userId, now);
  await next();
};