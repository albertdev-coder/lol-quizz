import 'server-only';
import Database from 'better-sqlite3';
import { Question, QuizLevel } from '@/types/quiz';
import { shuffleArray } from './quiz-utils';

const db = new Database('db/quiz.db', { readonly: true });

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

export function getAllQuestions(): Question[] {
  const rows = db.prepare('SELECT * FROM questions').all();
  return rows.map(mapRowToQuestion);
}

export function getQuestionsByLevel(level: QuizLevel): Question[] {
  if (level === 'mixto') {
    const rows = db.prepare('SELECT * FROM questions').all();
    return shuffleArray<Question>(rows.map(mapRowToQuestion));
  }

  const rows = db.prepare('SELECT * FROM questions WHERE level = ?').all(level);
  return rows.map(mapRowToQuestion);
}

export function getRandomQuestions(level?: QuizLevel, count?: number): Question[] {
  let rows: any[];

  if (!level || level === 'mixto') {
    rows = db.prepare('SELECT * FROM questions').all();
  } else {
    rows = db.prepare('SELECT * FROM questions WHERE level = ?').all(level);
  }

  // 👇 Aquí está el fix real: tipamos shuffleArray
  const questions: Question[] = shuffleArray<Question>(
    rows.map(mapRowToQuestion)
  );

  if (count && count > 0) {
    return questions.slice(0, count);
  }

  return questions;
}
