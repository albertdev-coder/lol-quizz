import { rankLeaderboard, type LeaderboardEntry } from '@/domains/ranking/ranking.service';

export function toGlobalLeaderboard(entries: LeaderboardEntry[]) {
  return rankLeaderboard(entries);
}

export function toWeeklyLeaderboard(entries: LeaderboardEntry[]) {
  return rankLeaderboard(entries);
}
