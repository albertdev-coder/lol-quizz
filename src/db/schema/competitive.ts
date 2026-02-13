import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { LEAGUES } from '@/core/constants/leagues';

export const leagueEnum = pgEnum('league', LEAGUES);
export const transactionTypeEnum = pgEnum('transaction_type', ['reward', 'penalty', 'bonus']);

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    username: text('username').notNull(),
    avatarUrl: text('avatar_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('users_username_unique').on(table.username)]
);

export const userStats = pgTable(
  'user_stats',
  {
    userId: uuid('user_id')
      .primaryKey()
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    elo: integer('elo').notNull().default(1000),
    league: leagueEnum('league').notNull().default('Bronce'),
    neuroCoins: integer('neuro_coins').notNull().default(0),
    wins: integer('wins').notNull().default(0),
    losses: integer('losses').notNull().default(0),
    streakDays: integer('streak_days').notNull().default(0),
    bestStreakDays: integer('best_streak_days').notNull().default(0),
    lastActiveAt: timestamp('last_active_at', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('user_stats_elo_idx').on(table.elo), index('user_stats_league_idx').on(table.league)]
);

export const seasons = pgTable(
  'seasons',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
    endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
    isActive: boolean('is_active').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('seasons_slug_unique').on(table.slug), index('seasons_is_active_idx').on(table.isActive)]
);

export const matches = pgTable(
  'matches',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    seasonId: uuid('season_id')
      .notNull()
      .references(() => seasons.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
    score: integer('score').notNull(),
    maxScore: integer('max_score').notNull(),
    durationMs: integer('duration_ms').notNull(),
    isWin: boolean('is_win').notNull(),
    eloBefore: integer('elo_before').notNull(),
    eloAfter: integer('elo_after').notNull(),
    leagueAfter: leagueEnum('league_after').notNull(),
    neuroCoinsAwarded: integer('neuro_coins_awarded').notNull(),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    playedAt: timestamp('played_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('matches_user_played_at_idx').on(table.userId, table.playedAt), index('matches_season_idx').on(table.seasonId)]
);

export const streaks = pgTable(
  'streaks',
  {
    userId: uuid('user_id')
      .primaryKey()
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    streakDays: integer('streak_days').notNull().default(0),
    bestStreakDays: integer('best_streak_days').notNull().default(0),
    multiplierBasisPoints: integer('multiplier_basis_points').notNull().default(10_000),
    lastClaimAt: timestamp('last_claim_at', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('streaks_best_streak_idx').on(table.bestStreakDays)]
);

export const transactions = pgTable(
  'transactions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    type: transactionTypeEnum('type').notNull(),
    amount: integer('amount').notNull(),
    balanceAfter: integer('balance_after').notNull(),
    referenceMatchId: uuid('reference_match_id').references(() => matches.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('transactions_user_created_at_idx').on(table.userId, table.createdAt)]
);

export const achievements = pgTable(
  'achievements',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    code: text('code').notNull(),
    progress: bigint('progress', { mode: 'number' }).notNull().default(0),
    unlockedAt: timestamp('unlocked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('achievements_user_code_unique').on(table.userId, table.code)]
);
