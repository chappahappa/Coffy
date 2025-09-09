import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const db = new Database('bot.sqlite');

// Создаём таблицы
db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  username TEXT,
  first_message_at TEXT DEFAULT CURRENT_TIMESTAMP,
  last_message_at TEXT DEFAULT CURRENT_TIMESTAMP,
  messages_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  username TEXT,
  user_message TEXT,
  bot_response TEXT,
  created_at_user TEXT DEFAULT CURRENT_TIMESTAMP,
  created_at_bot TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id)
)
`).run();

export class DBService {
  // Добавляем или обновляем пользователя
  addOrUpdateUser(userId: number, username: string) {
    const stmt = db.prepare(`
      INSERT INTO users(id, username, first_message_at, last_message_at, messages_count)
      VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1)
      ON CONFLICT(id) DO UPDATE SET
        last_message_at = CURRENT_TIMESTAMP,
        messages_count = messages_count + 1,
        username = excluded.username
    `);
    return stmt.run(userId, username);
  }

  // Добавляем сообщение (user + bot)
  addMessage(userId: number, username: string, userMessage: string, botResponse?: string) {
    const stmt = db.prepare(`
      INSERT INTO messages(user_id, username, user_message, bot_response, created_at_user, created_at_bot)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
    `);
    return stmt.run(userId, username, userMessage, botResponse || null, botResponse ? new Date().toISOString() : null);
  }

  // Обновление ответа бота позже
  updateBotResponse(messageId: number, botResponse: string) {
    const stmt = db.prepare(`
      UPDATE messages
      SET bot_response = ?, created_at_bot = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(botResponse, messageId);
  }

  // Пример выборки всех сообщений
  getAllMessages() {
    const stmt = db.prepare(`SELECT * FROM messages ORDER BY created_at_user`);
    return stmt.all();
  }

  // Пример выборки всех пользователей
  getAllUsers() {
    const stmt = db.prepare(`SELECT * FROM users ORDER BY messages_count DESC`);
    return stmt.all();
  }
}

export const dbService = new DBService();