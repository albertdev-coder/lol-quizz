// scripts/migrate-results.mjs
import Database from 'better-sqlite3';
import fs from 'fs';

const db = new Database('db/quiz.db');
const results = JSON.parse(fs.readFileSync('data/results.json', 'utf-8'));

if (results.length === 0) {
  console.log("No hay resultados para migrar.");
  process.exit(0);
}

const insert = db.prepare(`
  INSERT INTO results (id, level, score, totalQuestions, correctAnswers, incorrectAnswers, timeSpent, date, answers)
  VALUES (@id, @level, @score, @totalQuestions, @correctAnswers, @incorrectAnswers, @timeSpent, @date, @answers)
`);

const insertMany = db.transaction((rs) => {
  for (const r of rs) {
    insert.run({
      id: r.id,
      level: r.level,
      score: r.score,
      totalQuestions: r.totalQuestions,
      correctAnswers: r.correctAnswers,
      incorrectAnswers: r.incorrectAnswers,
      timeSpent: r.timeSpent || null,
      date: r.date,
      answers: JSON.stringify(r.answers),
    });
  }
});

insertMany(results);

console.log(`Migrated ${results.length} results to SQLite ✅`);
