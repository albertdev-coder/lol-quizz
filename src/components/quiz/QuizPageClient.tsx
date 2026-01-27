// src/components/quiz/QuizPageClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizLevel } from '@/types/quiz';
import { useQuiz } from '@/hooks/useQuiz';
import { LevelSelector } from '@/components/quiz/LevelSelector';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { QuizProgress } from '@/components/quiz/QuizProgress';
import { Button } from '@/components/ui/button';
import { Home, Loader2 } from 'lucide-react';

export default function QuizPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedLevel, setSelectedLevel] = useState<QuizLevel | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const levelParam = searchParams.get('level') as QuizLevel | null;
    if (levelParam && ['niño', 'joven', 'adulto', 'mixto'].includes(levelParam)) {
      setSelectedLevel(levelParam);
    }
  }, [searchParams]);

  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    isFinished,
    isLoading,
    progress,
    submitAnswer,
    getResults,
  } = useQuiz(selectedLevel || 'niño');

  useEffect(() => {
    if (isFinished) {
      const results = getResults();
      localStorage.setItem('lastQuizResults', JSON.stringify(results));
      router.push('/results');
    }
  }, [isFinished, getResults, router]);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin" style={{ color: 'var(--color-purple-dark)' }} />
      </div>
    );
  }

  if (!selectedLevel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="rounded-full hover:opacity-80"
            style={{ borderWidth: '2px', borderColor: 'var(--color-purple-light)' }}
          >
            <Home className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
        </motion.div>
        <LevelSelector onSelectLevel={setSelectedLevel} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-16 h-16" style={{ color: 'var(--color-purple-dark)' }} />
        </motion.div>
        <p className="mt-6 text-xl font-medium" style={{ color: 'var(--color-gray-700)' }}>
          Cargando preguntas...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Button
          onClick={() => {
            if (confirm('¿Estás seguro de que quieres salir del quiz? Perderás tu progreso.')) {
              router.push('/');
            }
          }}
          variant="outline"
          className="rounded-full hover:opacity-80"
          style={{ borderWidth: '2px', borderColor: 'var(--color-purple-light)' }}
        >
          <Home className="w-4 h-4 mr-2" />
          Salir
        </Button>
      </motion.div>

      <QuizProgress current={currentQuestionIndex + 1} total={totalQuestions} progress={progress} />

      <AnimatePresence mode="wait">
        {currentQuestion && (
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            onAnswer={submitAnswer}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
