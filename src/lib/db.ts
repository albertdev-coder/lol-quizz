import 'server-only';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db', 'quiz.db');
const db = new Database(dbPath);

/**
 * SERVER-ONLY: Get questions from database with optional filtering
 * This function can only be used in server components and API routes
 * @param level - Optional level filter (omit or use 'mixto' for all levels)
 * @param count - Optional limit on number of questions
 * @returns Array of question records from database
 */
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

/**
 * SERVER-ONLY: Get a single question by ID from database
 * This function can only be used in server components and API routes
 * @param id - Question ID
 * @returns Question record or undefined if not found
 */
export function getQuestionById(id: string) {
  return db.prepare('SELECT * FROM questions WHERE id = ?').get(id);
}

/**
 * SERVER-ONLY: Save a quiz result to database
 * This function can only be used in server components and API routes
 * @param result - Quiz result object to save
 */
export function saveResult(result: any) {
  db.prepare(
    `INSERT INTO results 
     (id, level, score, totalQuestions, correctAnswers, incorrectAnswers, timeSpent, date, answers) 
     VALUES (@id, @level, @score, @totalQuestions, @correctAnswers, @incorrectAnswers, @timeSpent, @date, @answers)`
  ).run(result);
}

/**
 * SERVER-ONLY: Get quiz results from database with optional filtering
 * This function can only be used in server components and API routes
 * @param level - Optional level filter (omit or use 'mixto' for all levels)
 * @param limit - Maximum number of results to return (default: 10)
 * @param sortBy - Sort field: 'date' or 'score' (default: 'date')
 * @returns Array of result records from database
 */
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
