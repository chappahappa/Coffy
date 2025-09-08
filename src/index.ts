import { Bot } from "grammy";
import OpenAI from "openai";
import "dotenv/config";
import Redis from 'ioredis'

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY as string;
const REDIS_KEY = process.env.REDIS_URL as string

const bot = new Bot(TELEGRAM_TOKEN);
const redis = new Redis.default(REDIS_KEY);


bot.command("start", (ctx) =>
  ctx.reply("Добро пожаловать! 🚀 Я помогу практиковать английский. Пиши мне.")
);

const deepseek = new OpenAI({
  apiKey: DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

// Хранилище истории по каждому пользователю
const userHistories = new Map<number, any[]>();

// System prompt для всех пользователей
const SYSTEM_PROMPT = `
You are an English conversation partner.
- Always reply only in English.
- Correct the user's grammar/vocabulary mistakes politely.
- Keep your answers short and natural (2-3 sentences).
- Ask simple follow-up questions to encourage conversation.
- Do not go off-topic or give long lectures.
If the user writes in Russian, respond only in English and provide the English translation of their message.
`;

// Получить историю пользователя
async function getUserHistory(userId: number): Promise<any[]> {
  const data = await redis.get(`user:${userId}:history`);
  if (!data) return [{ role: "system", content: SYSTEM_PROMPT }];
  return JSON.parse(data);
}

// Сохранить историю пользователя
async function setUserHistory(userId: number, history: any[]) {
  // TTL 24 часа
  await redis.set(`user:${userId}:history`, JSON.stringify(history), "EX", 60 * 60 * 24);
}

async function askDeepSeek(userId: number, userMessage: string): Promise<string> {
  try {
    // Берём историю из Redis
    let history = await getUserHistory(userId);

    history.push({ role: "user", content: userMessage });

    const response = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: history,
      max_tokens: 300,
    });

    const reply = response?.choices?.[0]?.message?.content ?? "No answer";

    history.push({ role: "assistant", content: reply });

    // Обрезка до последних 10 сообщений + system prompt
    if (history.length > 20) {
      history = [history[0], ...history.slice(-19)];
    }

    await setUserHistory(userId, history);

    return reply;
  } catch (err) {
    console.error("Ошибка DeepSeek:", err);
    return "⚠️ Ошибка при запросе к DeepSeek API.";
  }
}

bot.on("message:text", async (ctx) => {
  const userMessage = ctx.message.text;
  const userId = ctx.from.id;

  // Печатает...
  const typingInterval = setInterval(() => {
    ctx.api.sendChatAction(ctx.chat.id, "typing").catch(() => {});
  }, 1000);

  const answer = await askDeepSeek(userId, userMessage);

  clearInterval(typingInterval);

  await ctx.reply(answer);
});

bot.start();
