import { Context } from "grammy";
import { analyticsService } from "../../services/analyticsService.js";

export const statsCommand = async (ctx: Context) => {
  const stats = await analyticsService.getUserStats(ctx.from?.id || 0);
  await ctx.reply(`Вы отправили сообщений: ${stats.messagesCount}`);
};