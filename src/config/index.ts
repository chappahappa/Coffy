import dotenv from "dotenv";
dotenv.config();

if (!process.env.TELEGRAM_TOKEN || !process.env.OPENAI_API_KEY ) {
  throw new Error("MISSING TELEGRAM OR OPENAI KEY BRO!");
}

export const config = {
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};

export const prompt_config = `
You are an English conversation partner.
- Always reply only in English.
- Correct the user's grammar/vocabulary mistakes politely.
- Keep your answers short and natural (2-3 sentences).
- Ask simple follow-up questions to encourage conversation.
- Do not go off-topic or give long lectures.
If the user writes in Russian, respond only in English and provide the English translation of their message.
`