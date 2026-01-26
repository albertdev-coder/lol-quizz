// scripts/migrate-questions.mjs
import Database from 'better-sqlite3';
import fs from 'fs';

const db = new Database('db/quiz.db');
const questions = JSON.parse(fs.readFileSync('data/questions.json', 'utf-8'));

const insert = db.prepare(`
  INSERT INTO questions (id, text, level, choices, correctIndex, explanation, image)
  VALUES (@id, @text, @level, @choices, @correctIndex, @explanation, @image)
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

console.log(`Migrated ${questions.length} questions to SQLite ✅`);
