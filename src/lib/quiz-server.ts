import 'server-only';
import { getDB } from '@/lib/db-singleton';
import { questions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { Question, QuizLevel } from '@/types/quiz';

function mapToQuestion(row: any): Question {
  return {
    id: row.id,
    text: row.question,
    level: row.level,
    choices: row.choices,
    correctIndex: row.correctAnswer,
    explanation: '',
    image: null,
  };
}

export async function getAllQuestions(): Promise<Question[]> {
  const db = getDB();
  const rows = await db.select().from(questions);
  return rows.map(mapToQuestion);
}

export async function getQuestionsByLevel(level: QuizLevel): Promise<Question[]> {
  const db = getDB();
  
  let rows;
  if (level === 'mixto') {
    rows = await db.select().from(questions);
  } else {
    rows = await db.select().from(questions).where(eq(questions.level, level));
  }
  
  return rows.map(mapToQuestion);
}

export async function getRandomQuestions(
  level?: QuizLevel,
  count?: number
): Promise<Question[]> {
  const db = getDB();
  
  let rows;
  if (!level || level === 'mixto') {
    rows = await db.select().from(questions);
  } else {
    rows = await db.select().from(questions).where(eq(questions.level, level));
  }
  
  const mapped = rows.map(mapToQuestion);
  
  for (let i = mapped.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mapped[i], mapped[j]] = [mapped[j], mapped[i]];
  }

  if (count && count > 0) {
    return mapped.slice(0, count);
  }

  return mapped;
}
