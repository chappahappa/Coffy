import { Bot } from "grammy";
import { config } from "../config/index.js";
import { loggingMiddleware } from "./middlewares/logging.js";
import { rateLimitMiddleware } from "./middlewares/rareLimits.js";
import { startCommand } from "./commands/start.js";
import { statsCommand } from "./commands/stats.js";
import { messageHandler } from "./handlers/messageHandler.js";
import { helpCommand } from "./commands/help.js";

const bot = new Bot(config.TELEGRAM_TOKEN);

// Middleware
bot.use(loggingMiddleware);
bot.use(rateLimitMiddleware);

// Команды
bot.command("start", startCommand);
bot.command("help", helpCommand);
bot.command("stats", statsCommand);

// Сообщения
bot.on("message", messageHandler);

bot.start();
console.log("Bot started!");