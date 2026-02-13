export function resolveQuizOutcome(correctAnswers: number, totalQuestions: number) {
  const threshold = Math.ceil(totalQuestions * 0.6);
  return correctAnswers >= threshold ? 'win' : 'loss';
}
