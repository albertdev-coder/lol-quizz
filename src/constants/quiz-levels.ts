import { DbQuizLevel, QuizLevel } from '@/types/quiz';

export const APP_LEVELS = [
  'principiante',
  'intermedio',
  'avanzado',
  'aprendiz',
  'creyente',
  'sabio',
  'fan',
  'entusiasta',
  'otaku_mater',
] as const satisfies readonly QuizLevel[];

export const DB_LEVELS = [
  'Principiante',
  'Intermedio',
  'Avanzado',
  'Aprendiz',
  'Creyente',
  'Sabio',
  'Fan',
  'Entusiasta',
  'Otaku Mater.',
] as const satisfies readonly DbQuizLevel[];

export const APP_TO_DB_LEVEL: Record<QuizLevel, DbQuizLevel> = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
  aprendiz: 'Aprendiz',
  creyente: 'Creyente',
  sabio: 'Sabio',
  fan: 'Fan',
  entusiasta: 'Entusiasta',
  otaku_mater: 'Otaku Mater.',
};

export const DB_TO_APP_LEVEL: Record<DbQuizLevel, QuizLevel> = {
  Principiante: 'principiante',
  Intermedio: 'intermedio',
  Avanzado: 'avanzado',
  Aprendiz: 'aprendiz',
  Creyente: 'creyente',
  Sabio: 'sabio',
  Fan: 'fan',
  Entusiasta: 'entusiasta',
  'Otaku Mater.': 'otaku_mater',
};

export function toDbLevel(level: QuizLevel): DbQuizLevel {
  return APP_TO_DB_LEVEL[level];
}

export function toAppLevel(level: DbQuizLevel): QuizLevel {
  return DB_TO_APP_LEVEL[level];
}
