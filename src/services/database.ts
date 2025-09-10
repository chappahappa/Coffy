import Database from 'better-sqlite3';

// создаём файл базы coffy.db
const db = new Database('coffy.db');

// таблица пользователей
db.exec(`
CREATE TABLE IF NOT EXISTS users (
    telegram_id INTEGER PRIMARY KEY,
    username TEXT,
    first_name TEXT,
    last_name TEXT,
    total_messages INTEGER DEFAULT 0,
    last_message_at TEXT
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id INTEGER,
    role TEXT,  -- 'user' или 'assistant'
    content TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (telegram_id) REFERENCES users(telegram_id)
);
`);

console.log("База данных готова");

// интерфейс пользователя
export interface User {
    telegram_id: number;
    username: string;
    first_name: string;
    last_name: string;
}

// добавление или обновление пользователя
export function upsertUser(user: User) {
    const stmt = db.prepare(`
        INSERT INTO users (telegram_id, username, first_name, last_name, total_messages, last_message_at)
        VALUES (@telegram_id, @username, @first_name, @last_name, 1, CURRENT_TIMESTAMP)
        ON CONFLICT(telegram_id)
        DO UPDATE SET
            username = @username,
            first_name = @first_name,
            last_name = @last_name,
            total_messages = total_messages + 1,
            last_message_at = CURRENT_TIMESTAMP
    `);
    stmt.run(user);
}

export function addMessage(telegram_id: number, role: 'user' | 'assistant', content: string) {
    const stmt = db.prepare(`
        INSERT INTO messages (telegram_id, role, content) 
        VALUES (?, ?, ?)
    `);
    stmt.run(telegram_id, role, content);
}

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}

export function getLastMessages(telegram_id: number, limit: number = 20): Message[] {
    const stmt = db.prepare(`
        SELECT role, content, created_at 
        FROM messages 
        WHERE telegram_id = ? 
        ORDER BY created_at DESC 
        LIMIT ?
    `);
    return stmt.all(telegram_id, limit).reverse() as Message[];
}