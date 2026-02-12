import { QuizCategory, QuizLevel } from '@/types/quiz';

export interface CategoryLevelOption {
  level: QuizLevel;
  title: string;
  description: string;
}

export interface CategoryConfig {
  id: QuizCategory;
  title: string;
  description: string;
  iconId: string;
  accentClass: string;
  levels: CategoryLevelOption[];
}

export const CATEGORY_CONFIG: Record<QuizCategory, CategoryConfig> = {
  ciencia: {
    id: 'ciencia',
    title: 'Ciencia',
    description: 'Explora el universo, la materia y la vida con retos dinámicos.',
    iconId: 'icon-ciencia',
    accentClass: 'from-sky-500 to-cyan-400',
    levels: [
      { level: 'principiante', title: 'Principiante', description: 'Bases claras para empezar con confianza.' },
      { level: 'intermedio', title: 'Intermedio', description: 'Pon a prueba tu lógica con desafíos equilibrados.' },
      { level: 'avanzado', title: 'Avanzado', description: 'Reta tus conocimientos con preguntas exigentes.' },
    ],
  },
  teologia: {
    id: 'teologia',
    title: 'Teología',
    description: 'Profundiza en la fe, la reflexión y la historia espiritual.',
    iconId: 'icon-teologia',
    accentClass: 'from-violet-500 to-fuchsia-500',
    levels: [
      { level: 'aprendiz', title: 'Aprendiz', description: 'Conceptos esenciales para iniciar el camino.' },
      { level: 'creyente', title: 'Creyente', description: 'Conecta doctrina, textos y contexto histórico.' },
      { level: 'sabio', title: 'Sabio', description: 'Preguntas profundas para mentes analíticas.' },
    ],
  },
  anime: {
    id: 'anime',
    title: 'Anime',
    description: 'Demuestra cuánto sabes de series, personajes y mundos épicos.',
    iconId: 'icon-anime',
    accentClass: 'from-amber-500 to-orange-500',
    levels: [
      { level: 'fan', title: 'Fan', description: 'Ideal para quienes están empezando en el anime.' },
      { level: 'entusiasta', title: 'Entusiasta', description: 'Más detalles, más memoria, más emoción.' },
      { level: 'otaku_mater', title: 'Otaku Mater.', description: 'Solo para verdaderos expertos del género.' },
    ],
  },
};

export const CATEGORY_LIST = Object.values(CATEGORY_CONFIG);

export function isQuizCategory(value: string | null): value is QuizCategory {
  return value !== null && value in CATEGORY_CONFIG;
}

export function getCategoryByLevel(level: QuizLevel): QuizCategory {
  const found = CATEGORY_LIST.find((category) =>
    category.levels.some((levelOption) => levelOption.level === level)
  );

  return found?.id ?? 'ciencia';
}
