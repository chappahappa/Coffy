import type { Middleware } from "grammy";
import { log } from "../../utils/logger.js";

export const loggingMiddleware: Middleware<any> = async (ctx, next) => {
  log(`User ${ctx.from?.username || ctx.from?.id}: ${ctx.message?.text}`);
  await next();
};