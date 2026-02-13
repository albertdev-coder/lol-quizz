import type { LeagueName } from '@/core/constants/leagues';

export type LeaderboardEntry = {
  userId: string;
  username: string;
  elo: number;
  league: LeagueName;
  wins: number;
  losses: number;
  streakDays: number;
};

export function rankLeaderboard(entries: LeaderboardEntry[]) {
  return [...entries]
    .sort((a, b) => {
      if (b.elo !== a.elo) return b.elo - a.elo;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.streakDays - a.streakDays;
    })
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
}
