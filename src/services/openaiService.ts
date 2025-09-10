import OpenAI from "openai";
import { config, prompt_config } from "../config/index.js";

class OpenaiService {
  client = new OpenAI({ 
    apiKey: config.OPENAI_API_KEY, 
    baseURL: "https://api.deepseek.com"
  });

  async getResponse(message: string) {
    const res = await this.client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: prompt_config },
        {role: "user", content:  message }
      ],
    });
    const firstChoice = res.choices?.[0];
    const content = firstChoice?.message?.content ?? "Hmm... no answer bro...";
    return content;
  }
}

export const openaiService = new OpenaiService();
