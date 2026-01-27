import { QuizLevel } from '@/types/quiz';

/**
 * PURE UTILITY: Shuffle an array using Fisher-Yates algorithm
 * This is a pure function safe for both client and server
 * @param array - Array to shuffle
 * @returns New shuffled array (does not mutate original)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * PURE UTILITY: Calculate percentage score
 * This is a pure function safe for both client and server
 * @param correctAnswers - Number of correct answers
 * @param totalQuestions - Total number of questions
 * @returns Score as percentage (0-100)
 */
export function calculateScore(correctAnswers: number, totalQuestions: number): number {
  if (totalQuestions === 0) return 0;
  return Math.round((correctAnswers / totalQuestions) * 100);
}

/**
 * PURE UTILITY: Format seconds to MM:SS string
 * This is a pure function safe for both client and server
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "5:23")
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * PURE UTILITY: Get Tailwind CSS gradient class for quiz level
 * This is a pure function safe for both client and server
 * @param level - Quiz level
 * @returns Tailwind CSS gradient class name
 */
export function getLevelColor(level: QuizLevel): string {
  switch (level) {
    case 'niño':
      return 'bg-gradient-blue-cyan';
    case 'joven':
      return 'bg-gradient-purple-pink';
    case 'adulto':
      return 'bg-gradient-purple-pink-strong';
    case 'mixto':
      return 'bg-gradient-yellow-orange';
    default:
      return 'bg-[#6b7280]';
  }
}

/**
 * PURE UTILITY: Get emoji icon for quiz level
 * This is a pure function safe for both client and server
 * @param level - Quiz level
 * @returns Emoji string
 */
export function getLevelEmoji(level: QuizLevel): string {
  switch (level) {
    case 'niño':
      return '🌟';
    case 'joven':
      return '🚀';
    case 'adulto':
      return '🧠';
    case 'mixto':
      return '🎯';
    default:
      return '❓';
  }
}

/**
 * PURE UTILITY: Get motivational message based on score
 * This is a pure function safe for both client and server
 * @param score - Quiz score (0-100)
 * @returns Object with title, message, and emoji
 */
export function getScoreMessage(score: number): {
  title: string;
  message: string;
  emoji: string;
} {
  if (score === 100) {
    return {
      title: '¡PERFECTO! 🎉',
      message: '¡Increíble! Has respondido todas las preguntas correctamente.',
      emoji: '🏆',
    };
  } else if (score >= 80) {
    return {
      title: '¡Excelente! 🌟',
      message: 'Has demostrado un gran conocimiento. ¡Sigue así!',
      emoji: '⭐',
    };
  } else if (score >= 60) {
    return {
      title: '¡Bien hecho! 👍',
      message: 'Buen trabajo. Con un poco más de práctica serás un experto.',
      emoji: '💪',
    };
  } else if (score >= 40) {
    return {
      title: '¡Sigue intentando! 💡',
      message: 'Has aprendido algo nuevo hoy. ¡No te rindas!',
      emoji: '📚',
    };
  } else {
    return {
      title: '¡Puedes mejorar! 🌱',
      message: 'Cada intento es una oportunidad para aprender más.',
      emoji: '🎓',
    };
  }
}

/**
 * PURE UTILITY: Get level name in Spanish
 * This is a pure function safe for both client and server
 * @param level - Quiz level
 * @returns Level name in Spanish
 */
export function getLevelName(level: QuizLevel): string {
  switch (level) {
    case 'niño':
      return 'Nivel Niño';
    case 'joven':
      return 'Nivel Joven';
    case 'adulto':
      return 'Nivel Adulto';
    case 'mixto':
      return 'Modo Mixto';
    default:
      return 'Desconocido';
  }
}

/**
 * PURE UTILITY: Get level description in Spanish
 * This is a pure function safe for both client and server
 * @param level - Quiz level
 * @returns Level description in Spanish
 */
export function getLevelDescription(level: QuizLevel): string {
  switch (level) {
    case 'niño':
      return 'Preguntas básicas y divertidas';
    case 'joven':
      return 'Desafíos intermedios';
    case 'adulto':
      return 'Preguntas avanzadas';
    case 'mixto':
      return 'Todos los niveles mezclados';
    default:
      return 'Nivel desconocido';
  }
}
