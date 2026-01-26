'use client';

import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface QuizProgressProps {
  current: number;
  total: number;
  progress: number;
}

export function QuizProgress({ current, total, progress }: QuizProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto mb-8"
    >
      <div 
        className="bg-white rounded-full p-4 shadow-lg" 
        style={{ borderWidth: '2px', borderColor: 'var(--color-purple-light)' }}
      >
        <div className="flex items-center justify-between mb-2 px-2">
          <span className="text-sm font-bold" style={{ color: 'var(--color-gray-600)' }}>
            Progreso
          </span>
          <span className="text-sm font-bold" style={{ color: 'var(--color-purple-dark)' }}>
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>
    </motion.div>
  );
}
