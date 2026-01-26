export type QuizLevel = 'niño' | 'joven' | 'adulto' | 'mixto';

export interface Question {
  id: string;
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
  level: QuizLevel;
  answers: UserAnswer[];
  date: string;
}

export interface QuizMetadata {
  category: string;
  totalQuestions: number;
  levels: Record<string, number>;
  generatedAt: string;
  topics: string[];
  version: string;
}
