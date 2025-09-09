import { Context } from "grammy";
import { analyticsService } from "../../services/analyticsService.js";
import { openaiService } from "../../services/openaiService.js";


export const messageHandler = async (ctx: Context) => {
  const message = ctx.message?.text;
  const userId = ctx.from?.id.toString();

  if (!message) return;
  await analyticsService.logMessage(ctx.from?.id || 0);
  const reply = await openaiService.getResponse(userId || "", message);
  await ctx.reply(reply);
};