import { Question, QuizLevel } from '@/types/quiz';
import questionsData from '@/../data/questions.json';

// Flag para activar/desactivar el uso de API
// Habilitado por defecto en el navegador
const USE_API = typeof window !== 'undefined';

/**
 * Obtener preguntas desde la API o fallback a JSON local
 */
export const fetchQuestionsFromAPI = async (level?: QuizLevel, count: number = 10): Promise<Question[]> => {
  if (!USE_API) {
    return getQuestionsByLevel(level || 'niño');
  }

  try {
    const params = new URLSearchParams();
    if (level && level !== 'mixto') {
      params.append('level', level);
    }
    params.append('count', count.toString());

    const response = await fetch(`/api/questions?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Error al obtener preguntas desde la API');
    }

    const result = await response.json();
    if (result.success && result.data) {
      return result.data as Question[];
    }

    // Fallback a JSON local si la API retorna datos inválidos
    console.warn('API response inválida, usando datos locales');
    return getQuestionsByLevel(level || 'niño');
  } catch (error) {
    console.error('Error fetching questions from API, usando datos locales:', error);
    return getQuestionsByLevel(level || 'niño');
  }
};

/**
 * Obtener preguntas directamente del JSON (modo legacy)
 */
export const getQuestionsByLevel = (level: QuizLevel): Question[] => {
  if (level === 'mixto') {
    return shuffleArray([...questionsData] as Question[]);
  }
  return (questionsData as Question[]).filter((q) => q.level === level);
};

export const getAllQuestions = (): Question[] => {
  return questionsData as Question[];
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const calculateScore = (correctAnswers: number, totalQuestions: number): number => {
  return Math.round((correctAnswers / totalQuestions) * 100);
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getLevelColor = (level: QuizLevel): string => {
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
};

export const getLevelEmoji = (level: QuizLevel): string => {
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
};

export const getScoreMessage = (score: number): { title: string; message: string; emoji: string } => {
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
};

/**
 * Guardar resultados del quiz en la API
 */
export const saveQuizResults = async (results: any): Promise<boolean> => {
  if (!USE_API) {
    // Si no usamos API, solo guardamos en localStorage
    return true;
  }

  try {
    const response = await fetch('/api/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(results),
    });

    if (!response.ok) {
      throw new Error('Error al guardar resultados en la API');
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error saving results to API:', error);
    return false;
  }
};
