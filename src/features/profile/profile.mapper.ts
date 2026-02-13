import type { UserStatsSnapshot } from '@/core/types/competitive';

export function toCompetitiveProfile(stats: UserStatsSnapshot) {
  return {
    userId: stats.userId,
    rankTitle: stats.league,
    elo: stats.elo,
    neuroCoins: stats.neuroCoins,
    streakDays: stats.streakDays,
    bestStreak: stats.bestStreak,
  };
}
