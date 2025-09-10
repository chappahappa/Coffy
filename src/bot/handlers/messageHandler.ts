import { Context } from "grammy";
import { openaiService } from "../../services/openaiService.js";
import { upsertUser,  addMessage, getLastMessages } from "../../services/database.js";

export const messageHandler = async (ctx: Context) => {
    const message = ctx.message?.text || "";
    const telegramUser = ctx.from;
    if (!telegramUser) return;

    const user = {
        telegram_id: telegramUser.id,
        username: telegramUser.username || "",
        first_name: telegramUser.first_name || "",
        last_name: telegramUser.last_name || "",
    };

    // обновляем статистику пользователя
    upsertUser(user);

    // сохраняем сообщение пользователя
    addMessage(user.telegram_id, 'user', message);

    const typingInterval = setInterval(() => ctx.replyWithChatAction("typing"), 1000);

    try {
       const context = getLastMessages(user.telegram_id, 20);

        // объединяем все сообщения в одну строку для контекста
          const contextText = context.map(msg => `${msg.role}: ${msg.content}`).join("\n");

          const reply = await openaiService.getResponse(contextText);
        await ctx.reply(reply);

        // сохраняем ответ бота
        addMessage(user.telegram_id, 'assistant', reply);

    } finally {
        clearInterval(typingInterval);
    }
};