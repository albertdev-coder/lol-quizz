'use client';

import { Question, QuizLevel, QuizResult } from '@/types/quiz';

/**
 * CLIENT-ONLY: Fetch questions from the API endpoint
 * This function uses browser fetch and can only be used in client components
 * @param level - Quiz level to fetch (optional)
 * @param count - Number of questions to fetch (default: 10)
 * @returns Promise resolving to array of questions
 */
export async function fetchQuestionsFromAPI(
  level?: QuizLevel,
  count: number = 10
): Promise<Question[]> {
  try {
    const params = new URLSearchParams();
    if (level && level !== 'mixto') {
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

/**
 * CLIENT-ONLY: Save quiz results to the API endpoint
 * This function uses browser fetch and can only be used in client components
 * @param results - Quiz results object to save
 * @returns Promise resolving to boolean indicating success
 */
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

/**
 * CLIENT-ONLY: Fetch quiz results from the API endpoint
 * This function uses browser fetch and can only be used in client components
 * @param level - Filter results by level (optional)
 * @param limit - Maximum number of results to fetch (default: 10)
 * @param sortBy - Sort field ('date' or 'score', default: 'date')
 * @returns Promise resolving to array of quiz results
 */
export async function fetchQuizResults(
  level?: QuizLevel,
  limit: number = 10,
  sortBy: 'date' | 'score' = 'date'
): Promise<QuizResult[]> {
  try {
    const params = new URLSearchParams();
    if (level && level !== 'mixto') {
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
