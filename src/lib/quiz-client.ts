'use client';

import { Question, QuizCategory, QuizLevel, QuizResult } from '@/types/quiz';

export async function fetchQuestionsFromAPI(
  category: QuizCategory,
  level?: QuizLevel,
  count: number = 10
): Promise<Question[]> {
  try {
    const params = new URLSearchParams();
    params.append('category', category);
    if (level) {
      params.append('level', level);
    }
    params.append('count', count.toString());

    const response = await fetch(`/api/questions?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result.data as Question[];
    }

    throw new Error('Invalid API response format');
  } catch (error) {
    console.error('Error fetching questions from API:', error);
    throw error;
  }
}

export async function saveQuizResults(results: QuizResult): Promise<boolean> {
  try {
    const response = await fetch('/api/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(results),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Error saving results to API:', error);
    return false;
  }
}

export async function fetchQuizResults(
  level?: QuizLevel,
  limit: number = 10,
  sortBy: 'date' | 'score' = 'date'
): Promise<QuizResult[]> {
  try {
    const params = new URLSearchParams();
    if (level) {
      params.append('level', level);
    }
    params.append('limit', limit.toString());
    params.append('sortBy', sortBy);

    const response = await fetch(`/api/results?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result.data as QuizResult[];
    }

    return [];
  } catch (error) {
    console.error('Error fetching results from API:', error);
    return [];
  }
}
