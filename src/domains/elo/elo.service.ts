import { BASE_ELO, LEAGUE_RULES, type LeagueName } from '@/core/constants/leagues';
import type { MatchOutcome } from '@/core/types/competitive';

const DEFAULT_K_FACTOR = 32;

type EloInput = {
  currentElo?: number;
  opponentElo?: number;
  outcome: MatchOutcome;
  kFactor?: number;
};

export function expectedScore(currentElo: number, opponentElo: number): number {
  return 1 / (1 + 10 ** ((opponentElo - currentElo) / 400));
}

export function updateElo({
  currentElo = BASE_ELO,
  opponentElo = BASE_ELO,
  outcome,
  kFactor = DEFAULT_K_FACTOR,
}: EloInput) {
  const actualScore = outcome === 'win' ? 1 : 0;
  const exp = expectedScore(currentElo, opponentElo);
  const nextElo = Math.max(0, Math.round(currentElo + kFactor * (actualScore - exp)));

  return {
    previousElo: currentElo,
    nextElo,
    delta: nextElo - currentElo,
    league: resolveLeague(nextElo),
  };
}

export function resolveLeague(elo: number): LeagueName {
  let currentLeague: LeagueName = LEAGUE_RULES[0].name;

  for (const rule of LEAGUE_RULES) {
    if (elo >= rule.minElo) {
      currentLeague = rule.name;
      continue;
    }

    break;
  }

  return currentLeague;
}
