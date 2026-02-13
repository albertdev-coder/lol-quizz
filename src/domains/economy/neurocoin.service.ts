import type { MatchOutcome } from '@/core/types/competitive';

type NeuroCoinInput = {
  score: number;
  maxScore: number;
  outcome: MatchOutcome;
  streakMultiplier?: number;
};

const BASE_WIN_REWARD = 25;
const BASE_LOSS_REWARD = 10;

export function calculateNeuroCoinReward({
  score,
  maxScore,
  outcome,
  streakMultiplier = 1,
}: NeuroCoinInput) {
  const safeMaxScore = Math.max(1, maxScore);
  const precisionRatio = Math.min(1, Math.max(0, score / safeMaxScore));
  const base = outcome === 'win' ? BASE_WIN_REWARD : BASE_LOSS_REWARD;

  const reward = Math.round((base + precisionRatio * 20) * streakMultiplier);

  return Math.max(0, reward);
}
