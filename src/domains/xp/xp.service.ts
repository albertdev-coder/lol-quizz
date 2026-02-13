export function calculateXp(score: number, maxScore: number) {
  const ratio = Math.max(0, Math.min(1, score / Math.max(1, maxScore)));
  return Math.round(50 + ratio * 100);
}
