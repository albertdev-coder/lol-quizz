import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizPageClient } from '@/components/quiz/QuizPageClient';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

vi.mock('@/lib/quiz-client', () => ({
  fetchQuestions: vi.fn().mockResolvedValue([
    {
      id: 'q-001',
      text: '¿Cuál es el planeta más grande?',
      choices: ['Marte', 'Júpiter', 'Saturno', 'Tierra'],
      correctIndex: 1,
      level: 'niño',
      explanation: 'Júpiter es el más grande',
    },
    {
      id: 'q-002',
      text: '¿Qué gas respiran las plantas?',
      choices: ['Oxígeno', 'Nitrógeno', 'Dióxido de carbono', 'Hidrógeno'],
      correctIndex: 2,
      level: 'niño',
      explanation: 'Las plantas respiran CO2',
    },
  ]),
}));

describe('QuizPageClient', () => {
  it('should render loading state initially', () => {
    render(<QuizPageClient level="niño" />);
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it('should render level selector', async () => {
    render(<QuizPageClient level="niño" />);
    
    await screen.findByText('¿Cuál es el planeta más grande?');
    
    expect(screen.getByText('Selecciona una respuesta')).toBeInTheDocument();
  });

  it('should display question text', async () => {
    render(<QuizPageClient level="niño" />);
    
    const question = await screen.findByText('¿Cuál es el planeta más grande?');
    expect(question).toBeInTheDocument();
  });

  it('should display 4 answer choices', async () => {
    render(<QuizPageClient level="niño" />);
    
    await screen.findByText('¿Cuál es el planeta más grande?');
    
    expect(screen.getByText('Marte')).toBeInTheDocument();
    expect(screen.getByText('Júpiter')).toBeInTheDocument();
    expect(screen.getByText('Saturno')).toBeInTheDocument();
    expect(screen.getByText('Tierra')).toBeInTheDocument();
  });

  it('should show progress indicator', async () => {
    render(<QuizPageClient level="niño" />);
    
    await screen.findByText('¿Cuál es el planeta más grande?');
    
    expect(screen.getByText(/pregunta 1 de 2/i)).toBeInTheDocument();
  });
});
