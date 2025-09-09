import { Context } from "grammy";
import { dbService } from "../../services/dbService.js";
import { redisService } from "../../services/redisService.js";
import { openaiService } from "../../services/openaiService.js";
import { analyticsService } from "../../services/analyticsService.js";

export const messageHandler = async (ctx: Context) => {
  const message = ctx.message?.text;
  const userId = ctx.from?.id;
  const username = ctx.from?.username || "Unknown";

  if (!message || !userId) return;

  // 1️⃣ Логируем сообщение в Redis/analyticsService
  await analyticsService.logMessage(userId);
  await redisService.addMessage(userId.toString(), "user", message);

  // 2️⃣ Добавляем или обновляем пользователя в users
  dbService.addOrUpdateUser(userId, username);

  // 3️⃣ Генерируем ответ бота
  const reply = await openaiService.getResponse(userId.toString(), message);

  // 4️⃣ Сохраняем сообщение и ответ бота в messages
  dbService.addMessage(userId, username, message, reply);

  // 5️⃣ Сохраняем ответ в Redis
  await redisService.addMessage(userId.toString(), "assistant", reply);

  // 6️⃣ Отправляем пользователю
  await ctx.reply(reply);
};