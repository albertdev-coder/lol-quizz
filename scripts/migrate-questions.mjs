// scripts/migrate-questions.mjs
import Database from "better-sqlite3";
import fs from "fs";

console.log("📥 Migrating questions.json → SQLite...\n");

// Asegurar carpeta db/
import path from "path";
const dbDir = path.join(process.cwd(), "db");
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir);

// Abrir o crear DB
const db = new Database("db/quiz.db");

// Crear tabla correctamente
db.exec(`
  CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    level TEXT NOT NULL,
    choices TEXT NOT NULL,
    correctIndex INTEGER NOT NULL,
    explanation TEXT,
    image TEXT
  );
`);

console.log("📦 Table 'questions' ready.\n");

// Leer JSON
const questions = JSON.parse(fs.readFileSync("data/questions.json", "utf-8"));

// Preparar insert
const insert = db.prepare(`
  INSERT INTO questions (
    id,
    text,
    level,
    choices,
    correctIndex,
    explanation,
    image
  ) VALUES (
    @id,
    @text,
    @level,
    @choices,
    @correctIndex,
    @explanation,
    @image
  )
`);

const insertMany = db.transaction((qs) => {
  for (const q of qs) {
    insert.run({
      id: q.id,
      text: q.text,
      level: q.level,
      choices: JSON.stringify(q.choices),
      correctIndex: q.correctIndex,
      explanation: q.explanation || null,
      image: q.image || null,
    });
  }
});

insertMany(questions);

console.log(`✅ Migrated ${questions.length} questions to SQLite`);
