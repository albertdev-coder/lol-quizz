'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { QuizCategory, QuizLevel } from '@/types/quiz';
import { CATEGORY_CONFIG } from '@/constants/quiz-categories';
import { getLevelColor, getLevelEmoji } from '@/lib/quiz-utils';

interface LevelSelectorProps {
  category: QuizCategory;
  onSelectLevel: (level: QuizLevel) => void;
}

export function LevelSelector({ category, onSelectLevel }: LevelSelectorProps) {
  const categoryConfig = CATEGORY_CONFIG[category];

  return (
    <section className="w-full max-w-5xl px-4" aria-label={`Niveles de ${categoryConfig.title}`}>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-700">{categoryConfig.title}</p>
        <h2 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">Elige tu nivel</h2>
        <p className="mt-3 text-lg text-slate-600">Selecciona el reto ideal para comenzar.</p>
      </motion.header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {categoryConfig.levels.map((levelData, index) => (
          <motion.button
            key={levelData.level}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectLevel(levelData.level)}
            className="text-left"
          >
            <Card className="h-full rounded-3xl border border-violet-100 bg-white p-6 shadow-sm transition hover:shadow-lg">
              <div className={`mb-4 inline-flex rounded-2xl px-4 py-2 text-lg font-semibold text-white ${getLevelColor(levelData.level)}`}>
                {getLevelEmoji(levelData.level)}
              </div>
              <h3 className="text-2xl font-semibold text-slate-900">{levelData.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{levelData.description}</p>
            </Card>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
