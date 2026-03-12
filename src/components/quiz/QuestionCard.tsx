'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Question } from '@/types/quiz';
import { Check, X } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedIndex: number) => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: QuestionCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (hasAnswered) return;
    setSelectedIndex(index);
  };

  const handleSubmit = () => {
    if (selectedIndex === null || hasAnswered) return;
    setHasAnswered(true);
    
    // Esperar un momento para mostrar el feedback visual antes de continuar
    setTimeout(() => {
      onAnswer(selectedIndex);
      setSelectedIndex(null);
      setHasAnswered(false);
    }, 3000);
  };

  const getChoiceStyle = (index: number) => {
    if (!hasAnswered) {
      return selectedIndex === index
        ? 'bg-gradient-purple-pink text-white scale-105 shadow-lg'
        : 'bg-white hover:bg-[#faf5ff] hover:scale-102';
    }

    if (index === question.correctIndex) {
      return 'text-white scale-105 shadow-lg'
    }

    if (index === selectedIndex && index !== question.correctIndex) {
      return 'text-white scale-105 shadow-lg';
    }

    return 'bg-white opacity-50';
  };

  const getChoiceBackgroundStyle = (index: number) => {
    if (!hasAnswered) return {};
    
    if (index === question.correctIndex) {
      return { background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)' };
    }
    
    if (index === selectedIndex && index !== question.correctIndex) {
      return { background: 'linear-gradient(135deg, #f87171 0%, #f472b6 100%)' };
    }
    
    return {};
  };

  const getChoiceIcon = (index: number) => {
    if (!hasAnswered) return null;
    
    if (index === question.correctIndex) {
      return <Check className="w-6 h-6" />;
    }
    
    if (index === selectedIndex && index !== question.correctIndex) {
      return <X className="w-6 h-6" />;
    }
    
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto"
    >
      <Card 
        className="p-8 shadow-2xl rounded-3xl bg-white" 
        style={{ borderWidth: '4px', borderColor: 'var(--color-purple-light)' }}
      >
        {/* Número de pregunta */}
        <div className="flex items-center justify-between mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--color-coral) 0%, var(--color-orange-dark) 100%)' }}
          >
            Pregunta {questionNumber} / {totalQuestions}
          </motion.div>
        </div>

        {/* Imagen (si existe) */}
        {question.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 rounded-2xl overflow-hidden shadow-lg"
          >
            <img
              src={question.image}
              alt="Ilustración de la pregunta"
              className="w-full h-auto"
            />
          </motion.div>
        )}

        {/* Pregunta */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-3xl font-bold mb-8 leading-relaxed"
          style={{ color: 'var(--color-gray-800)' }}
        >
          {question.text}
        </motion.h2>

        {/* Opciones */}
        <div className="space-y-4 mb-8">
          {question.choices.map((choice, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              onClick={() => handleSelect(index)}
              disabled={hasAnswered}
              className={`w-full p-5 rounded-2xl text-left font-semibold text-lg transition-all duration-300 flex items-center justify-between ${getChoiceStyle(index)}`}
              style={{ 
                borderWidth: '3px', 
                borderColor: 'var(--color-purple-light)',
                ...getChoiceBackgroundStyle(index)
              }}
            >
              <span className="flex-1">{choice}</span>
              {getChoiceIcon(index)}
            </motion.button>
          ))}
        </div>

        {/* Explicación (solo después de responder) */}
        {hasAnswered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-6 rounded-2xl mb-6"
            style={{ 
              background: 'linear-gradient(135deg, #eff6ff 0%, #faf5ff 100%)',
              borderWidth: '2px',
              borderColor: 'var(--color-blue-light)'
            }}
          >
            <p className="text-lg" style={{ color: 'var(--color-gray-700)' }}>
              <strong style={{ color: 'var(--color-blue-dark)' }}>💡 Explicación:</strong> {question.explanation}
            </p>
          </motion.div>
        )}

        {/* Botón de continuar */}
        {!hasAnswered && (
          <Button
            onClick={handleSubmit}
            disabled={selectedIndex === null}
            size="lg"
            className="w-full bg-gradient-purple-pink-strong hover:opacity-90 text-white font-bold text-xl py-6 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
          >
            Confirmar respuesta
          </Button>
        )}
      </Card>
    </motion.div>
  );
}
