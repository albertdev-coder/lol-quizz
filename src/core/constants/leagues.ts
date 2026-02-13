export const LEAGUES = [
  'Bronce',
  'Plata',
  'Oro',
  'Platino',
  'Diamante',
  'Maestro',
  'Gran Maestro',
  'Titán',
  'Inmortal',
] as const;

export type LeagueName = (typeof LEAGUES)[number];

export type LeagueRule = {
  name: LeagueName;
  minElo: number;
};

export const LEAGUE_RULES: LeagueRule[] = [
  { name: 'Bronce', minElo: 0 },
  { name: 'Plata', minElo: 1100 },
  { name: 'Oro', minElo: 1300 },
  { name: 'Platino', minElo: 1500 },
  { name: 'Diamante', minElo: 1700 },
  { name: 'Maestro', minElo: 1900 },
  { name: 'Gran Maestro', minElo: 2100 },
  { name: 'Titán', minElo: 2300 },
  { name: 'Inmortal', minElo: 2500 },
];

export const BASE_ELO = 1000;
