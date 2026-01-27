import 'server-only';
import { Question, QuizLevel } from '@/types/quiz';
import questionsData from '@/../data/questions.json';
import { shuffleArray } from './quiz-utils';

/**
 * SERVER-ONLY: Get all questions from static JSON
 * This function can only be used in server components and API routes
 */
export function getAllQuestions(): Question[] {
  return questionsData as Question[];
}

/**
 * SERVER-ONLY: Get questions filtered by level from static JSON
 * This function can only be used in server components and API routes
 * @param level - Quiz level to filter by
 * @returns Array of questions for the specified level
 */
export function getQuestionsByLevel(level: QuizLevel): Question[] {
  if (level === 'mixto') {
    return shuffleArray([...questionsData] as Question[]);
  }
  return (questionsData as Question[]).filter((q) => q.level === level);
}

/**
 * SERVER-ONLY: Get random questions by level with optional count limit
 * This function can only be used in server components and API routes
 * @param level - Quiz level to filter by (optional, defaults to all levels)
 * @param count - Maximum number of questions to return (optional)
 * @returns Array of random questions
 */
export function getRandomQuestions(level?: QuizLevel, count?: number): Question[] {
  let questions: Question[];
  
  if (!level || level === 'mixto') {
    questions = shuffleArray([...questionsData] as Question[]);
  } else {
    questions = shuffleArray(
      (questionsData as Question[]).filter((q) => q.level === level)
    );
  }
  
  if (count && count > 0) {
    return questions.slice(0, count);
  }
  
  return questions;
}
