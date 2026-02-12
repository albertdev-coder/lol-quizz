import 'server-only';

import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { questions, results } from '@/lib/db/schema';
import { QuizCategory, QuizLevel } from '@/types/quiz';

export async function getQuestions(level?: QuizLevel, count?: number, categoryId: QuizCategory = 'ciencia') {
  const whereClause = [eq(questions.categoryId, categoryId)];

  if (level) {
    whereClause.push(eq(questions.level, level));
  }

  const rows = await db
    .select()
    .from(questions)
    .where(and(...whereClause))
    .orderBy(sql`RANDOM()`)
    .limit(count ?? 10);

  return rows;
}

export async function getQuestionById(id: string) {
  const row = await db.select().from(questions).where(eq(questions.id, id)).limit(1);
  return row[0];
}

export async function saveResult(result: {
  id: string;
  category: QuizCategory;
  level: QuizLevel;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeSpent: number;
  date: string;
  answers: unknown[];
}) {
  await db.insert(results).values({
    ...result,
    date: new Date(result.date),
  });
}

export async function getResults(level?: QuizLevel, limit = 10, sortBy: 'date' | 'score' = 'date') {
  const query = db.select().from(results);

  const whereQuery = level ? query.where(eq(results.level, level)) : query;

  return whereQuery
    .orderBy(sortBy === 'score' ? desc(results.score) : desc(results.date))
    .limit(limit);
}
