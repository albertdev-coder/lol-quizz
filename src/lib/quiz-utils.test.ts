import { describe, it, expect } from 'vitest';
import {
  shuffleArray,
  calculateScore,
  formatTime,
  getLevelColor,
  getLevelEmoji,
  getScoreMessage,
  getLevelName,
  getLevelDescription,
} from '@/lib/quiz-utils';

describe('quiz-utils', () => {
  describe('calculateScore', () => {
    it('should return 0 when totalQuestions is 0', () => {
      expect(calculateScore(0, 0)).toBe(0);
    });

    it('should calculate 100% score correctly', () => {
      expect(calculateScore(10, 10)).toBe(100);
    });

    it('should calculate 50% score correctly', () => {
      expect(calculateScore(5, 10)).toBe(50);
    });

    it('should round to nearest integer', () => {
      expect(calculateScore(1, 3)).toBe(33);
    });

    it('should handle all correct answers', () => {
      expect(calculateScore(100, 100)).toBe(100);
    });
  });

  describe('formatTime', () => {
    it('should format 0 seconds', () => {
      expect(formatTime(0)).toBe('0:00');
    });

    it('should format seconds under 60', () => {
      expect(formatTime(45)).toBe('0:45');
    });

    it('should format 1 minute', () => {
      expect(formatTime(60)).toBe('1:00');
    });

    it('should format minutes and seconds', () => {
      expect(formatTime(125)).toBe('2:05');
    });

    it('should format large values', () => {
      expect(formatTime(3661)).toBe('61:01');
    });
  });

  describe('getLevelColor', () => {
    it('should return blue-cyan for niño', () => {
      expect(getLevelColor('niño')).toBe('bg-gradient-blue-cyan');
    });

    it('should return purple-pink for joven', () => {
      expect(getLevelColor('joven')).toBe('bg-gradient-purple-pink');
    });

    it('should return purple-pink-strong for adulto', () => {
      expect(getLevelColor('adulto')).toBe('bg-gradient-purple-pink-strong');
    });

    it('should return yellow-orange for mixto', () => {
      expect(getLevelColor('mixto')).toBe('bg-gradient-yellow-orange');
    });
  });

  describe('getLevelEmoji', () => {
    it('should return star for niño', () => {
      expect(getLevelEmoji('niño')).toBe('🌟');
    });

    it('should return rocket for joven', () => {
      expect(getLevelEmoji('joven')).toBe('🚀');
    });

    it('should return brain for adulto', () => {
      expect(getLevelEmoji('adulto')).toBe('🧠');
    });

    it('should return target for mixto', () => {
      expect(getLevelEmoji('mixto')).toBe('🎯');
    });
  });

  describe('getScoreMessage', () => {
    it('should return perfect message for 100%', () => {
      const result = getScoreMessage(100);
      expect(result.title).toContain('PERFECTO');
      expect(result.emoji).toBe('🏆');
    });

    it('should return excellent message for 80-99%', () => {
      const result = getScoreMessage(85);
      expect(result.title).toContain('Excelente');
      expect(result.emoji).toBe('⭐');
    });

    it('should return good message for 60-79%', () => {
      const result = getScoreMessage(70);
      expect(result.title).toContain('Bien');
      expect(result.emoji).toBe('💪');
    });

    it('should return keep trying message for 40-59%', () => {
      const result = getScoreMessage(50);
      expect(result.title).toContain('intentando');
      expect(result.emoji).toBe('📚');
    });

    it('should return can improve message for 0-39%', () => {
      const result = getScoreMessage(20);
      expect(result.title).toContain('mejorar');
      expect(result.emoji).toBe('🎓');
    });
  });

  describe('getLevelName', () => {
    it('should return Spanish level names', () => {
      expect(getLevelName('niño')).toBe('Nivel Niño');
      expect(getLevelName('joven')).toBe('Nivel Joven');
      expect(getLevelName('adulto')).toBe('Nivel Adulto');
      expect(getLevelName('mixto')).toBe('Modo Mixto');
    });
  });

  describe('getLevelDescription', () => {
    it('should return Spanish descriptions', () => {
      expect(getLevelDescription('niño')).toBe('Preguntas básicas y divertidas');
      expect(getLevelDescription('joven')).toBe('Desafíos intermedios');
      expect(getLevelDescription('adulto')).toBe('Preguntas avanzadas');
      expect(getLevelDescription('mixto')).toBe('Todos los niveles mezclados');
    });
  });

  describe('shuffleArray', () => {
    it('should return a new array (not mutate original)', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);
      expect(original).toEqual([1, 2, 3, 4, 5]);
      expect(shuffled).not.toBe(original);
    });

    it('should contain all original elements', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);
      expect(shuffled.sort()).toEqual(original);
    });

    it('should handle empty array', () => {
      expect(shuffleArray([])).toEqual([]);
    });

    it('should handle single element', () => {
      expect(shuffleArray([1])).toEqual([1]);
    });
  });
});
