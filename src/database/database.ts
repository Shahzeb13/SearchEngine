import Database from "better-sqlite3";
import { indexerDocs } from "../crawler/crawler.ts";
const db = new Database("searchEngine.db");


export function  initDatabase(){

}

db.exec(`
  CREATE TABLE IF NOT EXISTS documents (
    uuid TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    currentUrl TEXT UNIQUE NOT NULL
  )
`);


const insert = db.prepare(`
  INSERT INTO documents (uuid, title, description, content, currentUrl)
  VALUES (@uuid, @title, @description, @content, @currentUrl)
`);


// Insert many at once (transaction = fast)
const insertMany = db.transaction((docs: typeof indexerDocs) => {
  for (const doc of docs) {
    insert.run(doc);
  }
});

insertMany(indexerDocs);


// Get all docs
const allDocs = db.prepare("SELECT * FROM documents").all();
const results = db.prepare(
  "SELECT * FROM documents WHERE content LIKE ?"
).all("%tortilla%");


db.close();