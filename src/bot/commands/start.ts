import { Context } from "grammy";

export const startCommand = async (ctx: Context) => {
  await ctx.reply("Привет! Я Coffy ☕. Давай практиковать английский вместе!");
};