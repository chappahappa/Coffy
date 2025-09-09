import OpenAI from "openai";
import { config, prompt_config } from "../config/index.js";
import { redisService } from "./redisService.js";

class OpenaiService {
  client = new OpenAI({ 
    apiKey: config.OPENAI_API_KEY, 
    baseURL: "https://api.deepseek.com"
  });

  async getResponse(userId: string, userMessage: string) {
    // добавляем сообщение пользователя в Redis
    await redisService.addMessage(userId, "user", userMessage);

    // достаём последние сообщения
    const history = await redisService.getMessages(userId);

    const res = await this.client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: prompt_config },
        ...history, // подставляем историю
      ],
    });

    const firstChoice = res.choices?.[0];
    const content = firstChoice?.message?.content ?? "Hmm... no answer...";

    // сохраняем ответ ассистента
    await redisService.addMessage(userId, "assistant", content);

    return content;
  }
}

export const openaiService = new OpenaiService();
