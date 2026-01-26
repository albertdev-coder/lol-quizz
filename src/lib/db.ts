import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db', 'quiz.db');
const db = new Database(dbPath);

// Exportar helpers
export function getQuestions(level?: string, count?: number) {
  let query = 'SELECT * FROM questions';
  const params: any[] = [];

  if (level && level !== 'mixto') {
    query += ' WHERE level = ?';
    params.push(level);
  }

  query += ' ORDER BY RANDOM()';
  if (count) {
    query += ' LIMIT ?';
    params.push(count);
  }

  return db.prepare(query).all(...params);
}

export function getQuestionById(id: string) {
  return db.prepare('SELECT * FROM questions WHERE id = ?').get(id);
}

export function saveResult(result: any) {
  db.prepare(
    `INSERT INTO results 
     (id, level, score, totalQuestions, correctAnswers, incorrectAnswers, timeSpent, date, answers) 
     VALUES (@id, @level, @score, @totalQuestions, @correctAnswers, @incorrectAnswers, @timeSpent, @date, @answers)`
  ).run(result);
}

export function getResults(level?: string, limit = 10, sortBy = 'date') {
  let query = 'SELECT * FROM results';
  const params: any[] = [];

  if (level && level !== 'mixto') {
    query += ' WHERE level = ?';
    params.push(level);
  }

  if (sortBy === 'score') {
    query += ' ORDER BY score DESC';
  } else {
    query += ' ORDER BY date DESC';
  }

  query += ' LIMIT ?';
  params.push(limit);

  return db.prepare(query).all(...params);
}
