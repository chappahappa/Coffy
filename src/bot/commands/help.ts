import { Context } from "grammy";

export const helpCommand = async (ctx: Context) => {
  const helpText = `
Привет! Я Coffy ☕ — твой языковой помощник.
Вот что я умею:

/start - начать диалог со мной
/help - показать эту справку
/stats - показать вашу статистику сообщений

💡 Советы:
- Пиши короткие сообщения, я отвечу быстро.
- Используй меня для практики английского.
- Попробуй задавать вопросы и просить примеры.
`;

  await ctx.reply(helpText);
};