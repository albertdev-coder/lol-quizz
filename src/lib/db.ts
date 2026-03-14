import { getDB } from '@/lib/db-singleton';
import { questions, results } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';

export async function getQuestions(level?: string, count = 10) {
  const db = getDB();

  let query = db.select().from(questions);

  if (level && level !== 'mixto') {
    query = query.where(eq(questions.level, level)) as typeof query;
  }

  const allQuestions = await query;

  const shuffled = allQuestions.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map((q) => ({
    id: q.id,
    text: q.question,
    level: q.level,
    choices: q.choices as string[],
    correctIndex: q.correctAnswer,
    explanation: q.explanation || '',
    image: null,
  }));
}

export async function getQuestionById(id: string) {
  const db = getDB();
  const result = await db.select().from(questions).where(eq(questions.id, id)).limit(1);
  if (!result[0]) return null;

  const q = result[0];
  return {
    id: q.id,
    text: q.question,
    level: q.level,
    choices: q.choices as string[],
    correctIndex: q.correctAnswer,
    explanation: q.explanation || '',
    image: null,
  };
}

export async function saveResult(result: {
  id: string;
  level: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeSpent: number;
  date: string;
  answers: unknown;
}) {
  const db = getDB();
  await db.insert(results).values({
    id: result.id,
    level: result.level,
    score: result.score,
    totalQuestions: result.totalQuestions,
    correctAnswers: result.correctAnswers,
    incorrectAnswers: result.incorrectAnswers,
    timeSpent: result.timeSpent,
    date: new Date(result.date),
    answers: result.answers as never,
  });
}

export async function getResults(level?: string, limit = 10, sortBy = 'date') {
  const db = getDB();

  let query = db.select().from(results);

  if (level && level !== 'mixto') {
    query = query.where(eq(results.level, level)) as typeof query;
  }

  if (sortBy === 'score') {
    query = query.orderBy(desc(results.score)) as typeof query;
  } else {
    query = query.orderBy(desc(results.date)) as typeof query;
  }

  return query.limit(limit);
}

export async function getResultById(id: string) {
  const db = getDB();
  const result = await db.select().from(results).where(eq(results.id, id)).limit(1);
  return result[0];
}
