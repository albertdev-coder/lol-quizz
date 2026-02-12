import 'server-only';

import { and, eq, sql } from 'drizzle-orm';
import { Question, QuizLevel } from '@/types/quiz';
import { toAppLevel, toDbLevel } from '@/constants/quiz-levels';
import { db } from '@/lib/db/client';
import { questions } from '@/lib/db/schema';
import { shuffleArray } from './quiz-utils';

function mapQuestion(row: typeof questions.$inferSelect): Question {
  return {
    id: row.id,
    categoryId: row.categoryId as Question['categoryId'],
    text: row.text,
    level: toAppLevel(row.level),
    choices: row.choices,
    correctIndex: row.correctIndex,
    explanation: row.explanation ?? '',
    image: row.image,
  };
}

export async function getAllQuestions(categoryId = 'ciencia'): Promise<Question[]> {
  const rows = await db.select().from(questions).where(eq(questions.categoryId, categoryId));
  return rows.map(mapQuestion);
}

export async function getQuestionsByLevel(level: QuizLevel, categoryId = 'ciencia'): Promise<Question[]> {
  const rows = await db
    .select()
    .from(questions)
    .where(and(eq(questions.categoryId, categoryId), eq(questions.level, toDbLevel(level))));

  return rows.map(mapQuestion);
}

export async function getRandomQuestions(
  level: QuizLevel | undefined,
  count = 10,
  categoryId = 'ciencia'
): Promise<Question[]> {
  const whereClause = [eq(questions.categoryId, categoryId)];

  if (level) {
    whereClause.push(eq(questions.level, toDbLevel(level)));
  }

  const rows = await db
    .select()
    .from(questions)
    .where(and(...whereClause))
    .orderBy(sql`RANDOM()`)
    .limit(count * 2);

  const shuffled = shuffleArray(rows.map(mapQuestion));
  return shuffled.slice(0, count);
}
