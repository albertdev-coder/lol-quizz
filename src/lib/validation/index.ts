/**
 * Validation Schemas - Barrel Export
 * Centralized exports for all Zod validation schemas
 */

export {
  // Individual Schemas
  QuizLevelSchema,
  QuestionIdSchema,
  ResultIdSchema,
  GetQuestionsQuerySchema,
  GetResultsQuerySchema,
  UserAnswerSchema,
  SaveResultBodySchema,
  ApiSuccessResponseSchema,
  ApiErrorResponseSchema,
  
  // TypeScript Types
  type GetQuestionsQuery,
  type GetResultsQuery,
  type SaveResultBody,
  type UserAnswer
} from './schemas';
