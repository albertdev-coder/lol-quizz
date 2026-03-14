'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Confetti from '@/components/Confetti';
import { QuizResult, Question } from '@/types/quiz';
import { getScoreMessage, getLevelColor, getLevelEmoji, formatTime } from '@/lib/quiz-utils';
import { saveQuizResults } from '@/lib/quiz-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, RotateCcw, Share2, Trophy, Clock, Check, X } from 'lucide-react';

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<QuizResult | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Cargar resultados del localStorage
    const savedResults = localStorage.getItem('lastQuizResults');
    if (savedResults) {
      const parsedResults = JSON.parse(savedResults) as QuizResult;
      setResults(parsedResults);

      // Mostrar confetti si el score es bueno
      if (parsedResults.score >= 70) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }

      // Intentar guardar resultados en la API
      if (!isSaved) {
        saveQuizResults(parsedResults).then((success) => {
          if (success) {
            setIsSaved(true);
            console.log('Resultados guardados en la API');
          }
        });
      }
    } else {
      router.push('/');
    }

    // Cargar las preguntas que se usaron en el quiz
    const savedQuestions = localStorage.getItem('lastQuizQuestions');
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
  }, [router, isSaved]);

  const handleShare = () => {
    if (!results) return;

    const text = `¡Obtuve ${results.score}% en el Quiz de Ciencia! ${getScoreMessage(results.score).emoji}`;

    if (navigator.share) {
      navigator
        .share({
          title: 'Quiz Ciencia - Mis Resultados',
          text: text,
          url: window.location.origin,
        })
        .catch(() => {
          // Si falla, copiar al portapapeles
          navigator.clipboard.writeText(text);
          alert('Resultado copiado al portapapeles');
        });
    } else {
      navigator.clipboard.writeText(text);
      alert('Resultado copiado al portapapeles');
    }
  };

  if (!results) {
    return null;
  }

  const scoreData = getScoreMessage(results.score);

  // Obtener detalles de cada pregunta
  const getQuestionById = (id: string) => {
    return questions.find((q) => q.id === id);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12">
      <Confetti active={showConfetti} duration={5000} />

      <div className="max-w-4xl w-full space-y-8">
        {/* Título y mensaje principal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-8xl mb-4"
          >
            {scoreData.emoji}
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient-purple-pink-orange">
            {scoreData.title}
          </h1>

          <p className="text-xl md:text-2xl mb-8" style={{ color: 'var(--color-gray-700)' }}>
            {scoreData.message}
          </p>
        </motion.div>

        {/* Tarjeta de estadísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card
            className="p-8 rounded-3xl shadow-2xl bg-white"
            style={{ borderWidth: '4px', borderColor: 'var(--color-purple-light)' }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div
                  className={`w-16 h-16 mx-auto mb-3 rounded-full ${getLevelColor(results.level)} flex items-center justify-center shadow-lg`}
                >
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: 'var(--color-purple-dark)' }}
                >
                  {results.score}%
                </div>
                <div className="text-sm font-medium" style={{ color: 'var(--color-gray-600)' }}>
                  Puntuación
                </div>
              </div>

              <div className="text-center">
                <div
                  className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)' }}
                >
                  <Check className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-1" style={{ color: '#10b981' }}>
                  {results.correctAnswers}
                </div>
                <div className="text-sm font-medium" style={{ color: 'var(--color-gray-600)' }}>
                  Correctas
                </div>
              </div>

              <div className="text-center">
                <div
                  className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #f87171 0%, #f472b6 100%)' }}
                >
                  <X className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-1" style={{ color: '#ef4444' }}>
                  {results.incorrectAnswers}
                </div>
                <div className="text-sm font-medium" style={{ color: 'var(--color-gray-600)' }}>
                  Incorrectas
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-blue-cyan flex items-center justify-center shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: 'var(--color-blue-dark)' }}
                >
                  {formatTime(results.timeSpent)}
                </div>
                <div className="text-sm font-medium" style={{ color: 'var(--color-gray-600)' }}>
                  Tiempo
                </div>
              </div>
            </div>

            <div
              className="mt-6 pt-6 text-center"
              style={{ borderTopWidth: '2px', borderTopColor: 'var(--color-purple-50)' }}
            >
              <div
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full"
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-purple-50) 0%, var(--color-pink-50) 100%)',
                  borderWidth: '2px',
                  borderColor: 'var(--color-purple-light)',
                }}
              >
                <span className="text-2xl">{getLevelEmoji(results.level)}</span>
                <span className="font-bold text-lg" style={{ color: 'var(--color-gray-800)' }}>
                  Nivel {results.level.charAt(0).toUpperCase() + results.level.slice(1)}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Resumen de respuestas */}
        {questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2
              className="text-2xl font-bold mb-4 text-center"
              style={{ color: 'var(--color-gray-800)' }}
            >
              📝 Resumen de Respuestas
            </h2>

            <div className="space-y-4">
              {results.answers.map((answer, index) => {
                const question = getQuestionById(answer.questionId);
                if (!question) return null;

                return (
                  <Card
                    key={`${answer.questionId}-${index}`}
                    className="p-6 rounded-2xl"
                    style={{
                      borderWidth: '3px',
                      borderColor: answer.isCorrect ? '#86efac' : '#fca5a5',
                      backgroundColor: answer.isCorrect ? '#f0fdf4' : '#fef2f2',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: answer.isCorrect ? '#22c55e' : '#ef4444' }}
                      >
                        {answer.isCorrect ? (
                          <Check className="w-6 h-6 text-white" />
                        ) : (
                          <X className="w-6 h-6 text-white" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h3
                          className="font-bold text-lg mb-2"
                          style={{ color: 'var(--color-gray-800)' }}
                        >
                          {index + 1}. {question.text}
                        </h3>

                        <div className="space-y-2 mb-3">
                          <p style={{ color: 'var(--color-gray-700)' }}>
                            <strong>Tu respuesta:</strong> {question.choices[answer.selectedIndex]}
                          </p>
                          {!answer.isCorrect && (
                            <p style={{ color: '#16a34a' }}>
                              <strong>Respuesta correcta:</strong>{' '}
                              {question.choices[question.correctIndex]}
                            </p>
                          )}
                        </div>

                        <div
                          className="p-4 bg-white rounded-lg"
                          style={{ borderWidth: '2px', borderColor: 'var(--color-blue-light)' }}
                        >
                          <p style={{ color: 'var(--color-gray-700)' }}>
                            <strong style={{ color: 'var(--color-blue-dark)' }}>
                              💡 Explicación:
                            </strong>{' '}
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Botones de acción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => router.push('/quiz')}
            size="lg"
            className="bg-gradient-purple-pink-strong hover:opacity-90 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Jugar de Nuevo
          </Button>

          <Button
            onClick={() => router.push('/')}
            size="lg"
            variant="outline"
            className="hover:opacity-80 font-bold text-lg px-8 py-6 rounded-full shadow-lg"
            style={{
              borderWidth: '3px',
              borderColor: 'var(--color-purple-light)',
              color: 'var(--color-purple-dark)',
            }}
          >
            <Home className="w-5 h-5 mr-2" />
            Volver al Inicio
          </Button>

          <Button
            onClick={handleShare}
            size="lg"
            variant="outline"
            className="hover:opacity-80 font-bold text-lg px-8 py-6 rounded-full shadow-lg"
            style={{
              borderWidth: '3px',
              borderColor: 'var(--color-blue-light)',
              color: 'var(--color-blue-dark)',
            }}
          >
            <Share2 className="w-5 h-5 mr-2" />
            Compartir
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
