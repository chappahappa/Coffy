import { Context } from "grammy";

export const statsCommand = async (ctx: Context) => {
  await ctx.reply(`Вы отправили сообщений: хз сколько`);
};