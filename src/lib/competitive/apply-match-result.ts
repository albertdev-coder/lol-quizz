import type { MatchResultInput, UserStatsSnapshot } from '@/core/types/competitive';
import { calculateNeuroCoinReward } from '@/domains/economy/neurocoin.service';
import { updateElo } from '@/domains/elo/elo.service';
import { resolveDailyStreak } from '@/domains/streak/streak.service';

export function applyMatchResult(stats: UserStatsSnapshot, result: MatchResultInput) {
  const playedAt = result.playedAt ?? new Date();
  const eloResult = updateElo({
    currentElo: stats.elo,
    outcome: result.outcome,
  });

  const streak = resolveDailyStreak({
    lastActiveAt: stats.lastActiveAt,
    playedAt,
    currentStreakDays: stats.streakDays,
    bestStreakDays: stats.bestStreak,
  });

  const neuroCoinGain = calculateNeuroCoinReward({
    score: result.score,
    maxScore: result.maxScore,
    outcome: result.outcome,
    streakMultiplier: streak.streakMultiplier,
  });

  return {
    nextStats: {
      ...stats,
      elo: eloResult.nextElo,
      league: eloResult.league,
      neuroCoins: stats.neuroCoins + neuroCoinGain,
      streakDays: streak.streakDays,
      bestStreak: streak.bestStreakDays,
      lastActiveAt: playedAt,
    },
    match: {
      userId: result.userId,
      seasonId: result.seasonId,
      score: result.score,
      maxScore: result.maxScore,
      durationMs: result.durationMs,
      isWin: result.outcome === 'win',
      eloBefore: stats.elo,
      eloAfter: eloResult.nextElo,
      leagueAfter: eloResult.league,
      neuroCoinsAwarded: neuroCoinGain,
      playedAt,
    },
    deltas: {
      elo: eloResult.delta,
      neuroCoins: neuroCoinGain,
      streak: streak.streakDays - stats.streakDays,
    },
  };
}
