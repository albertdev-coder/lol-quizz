export type QuizCategory = 'ciencia' | 'teologia' | 'anime';

export type QuizLevel =
  | 'principiante'
  | 'intermedio'
  | 'avanzado'
  | 'aprendiz'
  | 'creyente'
  | 'sabio'
  | 'fan'
  | 'entusiasta'
  | 'otaku_mater';

export interface Question {
  id: string;
  categoryId: QuizCategory;
  level: QuizLevel;
  text: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  image: string | null;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: UserAnswer[];
  startTime: number;
  endTime?: number;
  category: QuizCategory;
  level: QuizLevel;
}

export interface UserAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  timeSpent: number;
}

export interface QuizResult {
  id: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  timeSpent: number;
  category: QuizCategory;
  level: QuizLevel;
  answers: UserAnswer[];
  date: string;
}

export interface QuizMetadata {
  categories: Record<QuizCategory, { totalQuestions: number; levels: Record<string, number> }>;
  generatedAt: string;
  version: string;
}
