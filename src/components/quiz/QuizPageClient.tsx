'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Loader2 } from 'lucide-react';
import { useQuiz } from '@/hooks/useQuiz';
import { LevelSelector } from '@/components/quiz/LevelSelector';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { QuizProgress } from '@/components/quiz/QuizProgress';
import { Button } from '@/components/ui/button';
import { isQuizCategory } from '@/constants/quiz-categories';
import { QuizCategory, QuizLevel } from '@/types/quiz';

export default function QuizPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedLevel, setSelectedLevel] = useState<QuizLevel | null>(null);

  const category = useMemo<QuizCategory>(() => {
    const categoryParam = searchParams.get('category');
    return isQuizCategory(categoryParam) ? categoryParam : 'ciencia';
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
  } = useQuiz(category, selectedLevel);

  useEffect(() => {
    setSelectedLevel(null);
  }, [category]);

  useEffect(() => {
    if (isFinished) {
      const results = getResults();
      localStorage.setItem('lastQuizResults', JSON.stringify(results));
      router.push('/results');
    }
  }, [getResults, isFinished, router]);

  if (!selectedLevel) {
    return (
      <div className="min-h-screen p-4 py-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mb-8 w-fit">
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="rounded-full border-2 border-violet-200 hover:bg-violet-50"
          >
            <Home className="mr-2 h-4 w-4" />
            Volver al inicio
          </Button>
        </motion.div>
        <LevelSelector category={category} onSelectLevel={setSelectedLevel} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-14 w-14 animate-spin text-violet-700" />
        <p className="mt-4 text-lg text-slate-700">Cargando preguntas...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 py-12">
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
