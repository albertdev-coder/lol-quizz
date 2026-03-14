import { z } from 'zod';

/**
 * Validation Schemas with Zod
 * All API endpoints must validate inputs using these schemas
 */

// ============================================
// COMMON SCHEMAS
// ============================================

export const QuizLevelSchema = z.enum(['niño', 'joven', 'adulto', 'mixto']);

export const QuestionIdSchema = z.string().regex(/^q-\d{3}$/, {
  message: 'Invalid question ID format. Expected: q-001 to q-999',
});

export const ResultIdSchema = z.string().regex(/^result-\d+$/, {
  message: 'Invalid result ID format. Expected: result-{timestamp}',
});

// ============================================
// QUERY PARAMETERS SCHEMAS
// ============================================

export const GetQuestionsQuerySchema = z.object({
  level: QuizLevelSchema.optional(),
  count: z.coerce
    .number()
    .int()
    .min(1, 'Count must be at least 1')
    .max(50, 'Count cannot exceed 50')
    .default(10),
});

export const GetResultsQuerySchema = z.object({
  level: QuizLevelSchema.optional(),
  limit: z.coerce
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(10),
  sortBy: z.enum(['date', 'score']).default('date'),
});

// ============================================
// REQUEST BODY SCHEMAS
// ============================================

export const UserAnswerSchema = z.object({
  questionId: QuestionIdSchema,
  selectedIndex: z.number().int().min(0).max(3),
  isCorrect: z.boolean(),
  timeSpent: z.number().int().min(0).max(600, 'Time spent cannot exceed 10 minutes per question'),
});

export const SaveResultBodySchema = z
  .object({
    level: QuizLevelSchema,
    score: z.number().int().min(0).max(100),
    totalQuestions: z.number().int().min(1).max(50),
    correctAnswers: z.number().int().min(0),
    incorrectAnswers: z.number().int().min(0),
    timeSpent: z.number().int().min(0).max(3600, 'Total time cannot exceed 1 hour'),
    answers: z.array(UserAnswerSchema).min(1).max(50),
  })
  .refine((data) => data.correctAnswers + data.incorrectAnswers === data.totalQuestions, {
    message: 'correctAnswers + incorrectAnswers must equal totalQuestions',
  })
  .refine((data) => data.answers.length === data.totalQuestions, {
    message: 'answers array length must match totalQuestions',
  });

// ============================================
// RESPONSE SCHEMAS (for type safety)
// ============================================

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

// ============================================
// TYPE EXPORTS
// ============================================

export type GetQuestionsQuery = z.infer<typeof GetQuestionsQuerySchema>;
export type GetResultsQuery = z.infer<typeof GetResultsQuerySchema>;
export type SaveResultBody = z.infer<typeof SaveResultBodySchema>;
export type UserAnswer = z.infer<typeof UserAnswerSchema>;
