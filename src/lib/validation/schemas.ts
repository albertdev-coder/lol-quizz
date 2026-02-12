import { z } from 'zod';
import { APP_LEVELS } from '@/constants/quiz-levels';

export const QuizLevelSchema = z.enum(APP_LEVELS);

export const QuestionIdSchema = z.string().regex(/^q-\d{3}$/, {
  message: 'Formato inválido de ID de pregunta. Debe ser q-001 a q-999',
});

export const ResultIdSchema = z.string().regex(/^result-\d+$/, {
  message: 'Formato inválido de ID de resultado. Debe ser result-{timestamp}',
});

export const CategorySlugSchema = z.enum(['ciencia', 'anime', 'teologia']).default('ciencia');

export const GetQuestionsQuerySchema = z.object({
  level: QuizLevelSchema.optional(),
  category: CategorySlugSchema.optional(),
  count: z.coerce.number().int().min(1).max(50).default(10),
});

export const GetResultsQuerySchema = z.object({
  level: QuizLevelSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['date', 'score']).default('date'),
});

export const UserAnswerSchema = z.object({
  questionId: QuestionIdSchema,
  selectedIndex: z.number().int().min(0).max(3),
  isCorrect: z.boolean(),
  timeSpent: z.number().int().min(0).max(600),
});

export const SaveResultBodySchema = z
  .object({
    category: CategorySlugSchema,
    level: QuizLevelSchema,
    score: z.number().int().min(0).max(100),
    totalQuestions: z.number().int().min(1).max(50),
    correctAnswers: z.number().int().min(0),
    incorrectAnswers: z.number().int().min(0),
    timeSpent: z.number().int().min(0).max(3600),
    answers: z.array(UserAnswerSchema).min(1).max(50),
  })
  .refine((data) => data.correctAnswers + data.incorrectAnswers === data.totalQuestions, {
    message: 'correctAnswers + incorrectAnswers debe ser igual a totalQuestions',
  })
  .refine((data) => data.answers.length === data.totalQuestions, {
    message: 'answers debe tener la misma longitud que totalQuestions',
  });

export const ApiSuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.any().optional(),
  message: z.string().optional(),
  total: z.number().optional(),
  timestamp: z.string().optional(),
});

export const ApiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  errorCode: z.string().optional(),
  details: z.any().optional(),
});

export type GetQuestionsQuery = z.infer<typeof GetQuestionsQuerySchema>;
export type GetResultsQuery = z.infer<typeof GetResultsQuerySchema>;
export type SaveResultBody = z.infer<typeof SaveResultBodySchema>;
export type UserAnswer = z.infer<typeof UserAnswerSchema>;
