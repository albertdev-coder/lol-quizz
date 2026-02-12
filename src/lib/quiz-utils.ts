import { QuizLevel } from '@/types/quiz';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function calculateScore(correctAnswers: number, totalQuestions: number): number {
  if (totalQuestions === 0) return 0;
  return Math.round((correctAnswers / totalQuestions) * 100);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function getLevelColor(level: QuizLevel): string {
  switch (level) {
    case 'principiante':
    case 'aprendiz':
    case 'fan':
      return 'bg-gradient-blue-cyan';
    case 'intermedio':
    case 'creyente':
    case 'entusiasta':
      return 'bg-gradient-purple-pink';
    case 'avanzado':
    case 'sabio':
    case 'otaku_mater':
      return 'bg-gradient-purple-pink-strong';
    default:
      return 'bg-slate-500';
  }
}

export function getLevelEmoji(level: QuizLevel): string {
  switch (level) {
    case 'principiante':
    case 'aprendiz':
    case 'fan':
      return '🌱';
    case 'intermedio':
    case 'creyente':
    case 'entusiasta':
      return '⚡';
    case 'avanzado':
    case 'sabio':
    case 'otaku_mater':
      return '🔥';
    default:
      return '❓';
  }
}

export function getScoreMessage(score: number): { title: string; message: string; emoji: string } {
  if (score === 100) {
    return {
      title: '¡PERFECTO! 🎉',
      message: '¡Increíble! Has respondido todas las preguntas correctamente.',
      emoji: '🏆',
    };
  }

  if (score >= 80) {
    return {
      title: '¡Excelente! 🌟',
      message: 'Has demostrado un gran conocimiento. ¡Sigue así!',
      emoji: '⭐',
    };
  }

  if (score >= 60) {
    return {
      title: '¡Bien hecho! 👍',
      message: 'Buen trabajo. Con un poco más de práctica serás un experto.',
      emoji: '💪',
    };
  }

  if (score >= 40) {
    return {
      title: '¡Sigue intentando! 💡',
      message: 'Has aprendido algo nuevo hoy. ¡No te rindas!',
      emoji: '📚',
    };
  }

  return {
    title: '¡Puedes mejorar! 🌱',
    message: 'Cada intento es una oportunidad para aprender más.',
    emoji: '🎓',
  };
}

export function getLevelName(level: QuizLevel): string {
  const labels: Record<QuizLevel, string> = {
    principiante: 'Principiante',
    intermedio: 'Intermedio',
    avanzado: 'Avanzado',
    aprendiz: 'Aprendiz',
    creyente: 'Creyente',
    sabio: 'Sabio',
    fan: 'Fan',
    entusiasta: 'Entusiasta',
    otaku_mater: 'Otaku Mater',
  };

  return labels[level] ?? 'Nivel';
}
