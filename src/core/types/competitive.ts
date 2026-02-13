import type { LeagueName } from '@/core/constants/leagues';

export type MatchOutcome = 'win' | 'loss';

export type UserStatsSnapshot = {
  userId: string;
  elo: number;
  league: LeagueName;
  neuroCoins: number;
  streakDays: number;
  bestStreak: number;
  lastActiveAt: Date | null;
};

export type MatchResultInput = {
  userId: string;
  score: number;
  maxScore: number;
  durationMs: number;
  outcome: MatchOutcome;
  seasonId: string;
  playedAt?: Date;
};
