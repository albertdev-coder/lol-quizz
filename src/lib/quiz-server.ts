import 'server-only';
import Database from 'better-sqlite3';
import { Question, QuizLevel } from '@/types/quiz';
import { shuffleArray } from './quiz-utils';

// Base de datos en modo lectura/escritura
const db = new Database('db/quiz.db', { fileMustExist: true });

/**
 * Convierte una fila de la base de datos en un objeto Question tipado.
 */
function mapRowToQuestion(row: any): Question {
  return {
    id: row.id,
    text: row.text,
    level: row.level,
    choices: JSON.parse(row.choices),
    correctIndex: row.correctIndex,
    explanation: row.explanation,
    image: row.image,
  };
}

/**
 * Obtiene todas las preguntas sin filtros.
 */
export function getAllQuestions(): Question[] {
  const rows = db.prepare('SELECT * FROM questions').all();
  return rows.map(mapRowToQuestion);
}

/**
 * Obtiene preguntas filtradas por nivel.
 */
export function getQuestionsByLevel(level: QuizLevel): Question[] {
  if (level === 'mixto') {
    const rows = db.prepare('SELECT * FROM questions').all();
    return shuffleArray<Question>(rows.map(mapRowToQuestion));
  }

  const rows = db.prepare('SELECT * FROM questions WHERE level = ?').all(level);
  return rows.map(mapRowToQuestion);
}

/**
 * Obtiene preguntas aleatorias, con opción de nivel y cantidad.
 */
export function getRandomQuestions(
  level?: QuizLevel,
  count?: number
): Question[] {
  let rows: any[];

  if (!level || level === 'mixto') {
    rows = db.prepare('SELECT * FROM questions').all();
  } else {
    rows = db.prepare('SELECT * FROM questions WHERE level = ?').all(level);
  }

  const questions: Question[] = shuffleArray<Question>(
    rows.map(mapRowToQuestion)
  );

  if (count && count > 0) {
    return questions.slice(0, count);
  }

  return questions;
}
