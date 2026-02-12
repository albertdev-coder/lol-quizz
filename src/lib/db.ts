import 'server-only';

import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { questions, results } from '@/lib/db/schema';

export async function getQuestions(level?: string, count?: number, categoryId = 'ciencia') {
  const whereClause = [eq(questions.categoryId, categoryId)];

  if (level && level !== 'mixto') {
    whereClause.push(eq(questions.level, level as 'niño' | 'joven' | 'adulto'));
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
  level: 'niño' | 'joven' | 'adulto' | 'mixto';
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

export async function getResults(level?: string, limit = 10, sortBy: 'date' | 'score' = 'date') {
  const query = db.select().from(results);

  const whereQuery = level && level !== 'mixto' ? query.where(eq(results.level, level as any)) : query;

  return whereQuery
    .orderBy(sortBy === 'score' ? desc(results.score) : desc(results.date))
    .limit(limit);
}
