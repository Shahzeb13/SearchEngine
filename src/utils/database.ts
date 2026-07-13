import Database from "better-sqlite3";

const DB_PATH = "searchengine.db";

let db: Database.Database;

export function initDatabase(): Database.Database {
  if (db) return db;

  db = new Database(DB_PATH);

  db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      uuid TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      content TEXT,
      currentUrl TEXT UNIQUE NOT NULL
    )
  `);

  return db;
}
