const DAY_IN_MS = 86_400_000;

export type StreakInput = {
  lastActiveAt: Date | null;
  playedAt: Date;
  currentStreakDays: number;
  bestStreakDays: number;
};

export function resolveDailyStreak({
  lastActiveAt,
  playedAt,
  currentStreakDays,
  bestStreakDays,
}: StreakInput) {
  if (!lastActiveAt) {
    return {
      streakDays: 1,
      bestStreakDays: Math.max(1, bestStreakDays),
      streakMultiplier: 1,
      wasReset: false,
    };
  }

  const dayDiff = Math.floor((playedAt.getTime() - lastActiveAt.getTime()) / DAY_IN_MS);

  if (dayDiff <= 0) {
    const multiplier = getStreakMultiplier(currentStreakDays);

    return {
      streakDays: currentStreakDays,
      bestStreakDays,
      streakMultiplier: multiplier,
      wasReset: false,
    };
  }

  if (dayDiff === 1) {
    const streakDays = currentStreakDays + 1;

    return {
      streakDays,
      bestStreakDays: Math.max(bestStreakDays, streakDays),
      streakMultiplier: getStreakMultiplier(streakDays),
      wasReset: false,
    };
  }

  return {
    streakDays: 1,
    bestStreakDays: Math.max(bestStreakDays, 1),
    streakMultiplier: 1,
    wasReset: true,
  };
}

export function getStreakMultiplier(streakDays: number): number {
  if (streakDays >= 30) return 2;
  if (streakDays >= 14) return 1.5;
  if (streakDays >= 7) return 1.25;
  return 1;
}
