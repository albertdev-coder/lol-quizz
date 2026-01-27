'use client';

import { useState, useCallback, useEffect } from 'react';
import { Question, QuizLevel, UserAnswer, QuizResult } from '@/types/quiz';
import { fetchQuestionsFromAPI } from '@/lib/quiz-client';
import { calculateScore } from '@/lib/quiz-utils';

export const useQuiz = (level: QuizLevel) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        const loadedQuestions = await fetchQuestionsFromAPI(level, 10);
        setQuestions(loadedQuestions);
        // Guardar las preguntas en localStorage para la página de resultados
        localStorage.setItem('lastQuizQuestions', JSON.stringify(loadedQuestions));
        setStartTime(Date.now());
        setQuestionStartTime(Date.now());
      } catch (error) {
        console.error('Error loading questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [level]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const submitAnswer = useCallback(
    (selectedIndex: number) => {
      if (!currentQuestion) return;

      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
      const isCorrect = selectedIndex === currentQuestion.correctIndex;

      const userAnswer: UserAnswer = {
        questionId: currentQuestion.id,
        selectedIndex,
        isCorrect,
        timeSpent,
      };

      setAnswers((prev) => [...prev, userAnswer]);

      if (isLastQuestion) {
        setIsFinished(true);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
        setQuestionStartTime(Date.now());
      }
    },
    [currentQuestion, isLastQuestion, questionStartTime]
  );

  const getResults = useCallback((): QuizResult => {
    const endTime = Date.now();
    const totalTimeSpent = Math.floor((endTime - startTime) / 1000);
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const score = calculateScore(correctAnswers, questions.length);

    return {
      id: `result-${Date.now()}`,
      totalQuestions: questions.length,
      correctAnswers,
      incorrectAnswers: questions.length - correctAnswers,
      score,
      timeSpent: totalTimeSpent,
      level,
      answers,
      date: new Date().toISOString(),
    };
  }, [answers, questions.length, level, startTime]);

  const reset = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
    setIsFinished(false);
    
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        const loadedQuestions = await fetchQuestionsFromAPI(level, 10);
        setQuestions(loadedQuestions);
        // Guardar las preguntas en localStorage para la página de resultados
        localStorage.setItem('lastQuizQuestions', JSON.stringify(loadedQuestions));
      } catch (error) {
        console.error('Error loading questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [level]);

  return {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions: questions.length,
    isLastQuestion,
    isFinished,
    isLoading,
    progress,
    submitAnswer,
    getResults,
    reset,
    questions,
    answers,
  };
};
