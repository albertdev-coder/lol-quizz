'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QuizLevel } from '@/types/quiz';
import { getLevelColor, getLevelEmoji } from '@/lib/quiz-utils';
import { Sparkles, Rocket, Brain, Target } from 'lucide-react';

interface LevelSelectorProps {
  onSelectLevel: (level: QuizLevel) => void;
}

const levels = [
  {
    level: 'niño' as QuizLevel,
    title: 'Nivel Niño',
    description: 'Preguntas básicas y divertidas',
    icon: Sparkles,
    emoji: '🌟',
  },
  {
    level: 'joven' as QuizLevel,
    title: 'Nivel Joven',
    description: 'Desafíos intermedios',
    icon: Rocket,
    emoji: '🚀',
  },
  {
    level: 'adulto' as QuizLevel,
    title: 'Nivel Adulto',
    description: 'Preguntas avanzadas',
    icon: Brain,
    emoji: '🧠',
  },
  {
    level: 'mixto' as QuizLevel,
    title: 'Modo Mixto',
    description: 'Todos los niveles mezclados',
    icon: Target,
    emoji: '🎯',
  },
];

export function LevelSelector({ onSelectLevel }: LevelSelectorProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-purple-pink-orange">
          Elige tu nivel
        </h2>
        <p className="text-xl" style={{ color: 'var(--color-gray-600)' }}>
          Selecciona el nivel que mejor se adapte a ti
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {levels.map((levelData, index) => {
          const Icon = levelData.icon;
          return (
            <motion.div
              key={levelData.level}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                onClick={() => onSelectLevel(levelData.level)}
                className="p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 rounded-3xl bg-white group"
                style={{ borderWidth: '4px', borderColor: 'var(--color-purple-light)' }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-6 rounded-full ${getLevelColor(levelData.level)} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2" style={{ color: 'var(--color-gray-800)' }}>
                      <span>{levelData.emoji}</span>
                      <span>{levelData.title}</span>
                    </h3>
                    <p className="text-lg" style={{ color: 'var(--color-gray-600)' }}>
                      {levelData.description}
                    </p>
                  </div>

                  <Button
                    size="lg"
                    className={`w-full ${getLevelColor(levelData.level)} text-white font-bold text-lg py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    ¡Empezar!
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
