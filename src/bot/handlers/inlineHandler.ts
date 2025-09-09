import { Context } from "grammy";

// Пример для inline кнопок
export const inlineHandler = async (ctx: Context) => {
  const data = ctx.callbackQuery?.data;
  if (!data) return;
  await ctx.answerCallbackQuery({ text: `Вы нажали: ${data}` });
};