// src/app/quiz/page.tsx
// Server component wrapper — forces dynamic rendering and delegates to the client component.
export const dynamic = 'force-dynamic';

import QuizPageClient from '@/components/quiz/QuizPageClient';

export default function QuizPage() {
  return <QuizPageClient />;
}
