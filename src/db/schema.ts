import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  boolean,
  jsonb,
} from 'drizzle-orm/pg-core';

export const questions = pgTable('questions', {
  id: varchar('id', { length: 10 }).primaryKey(),
  question: text('question').notNull(),
  choices: jsonb('choices').notNull(),
  correctAnswer: integer('correctAnswer').notNull(),
  level: varchar('level', { length: 20 }).notNull(),
  category: varchar('category', { length: 50 }),
  difficulty: varchar('difficulty', { length: 20 }),
  explanation: text('explanation'),
});

export const results = pgTable('results', {
  id: varchar('id', { length: 50 }).primaryKey(),
  level: varchar('level', { length: 20 }).notNull(),
  score: integer('score').notNull(),
  totalQuestions: integer('totalQuestions').notNull(),
  correctAnswers: integer('correctAnswers').notNull(),
  incorrectAnswers: integer('incorrectAnswers').notNull(),
  timeSpent: integer('timeSpent').notNull(),
  date: timestamp('date').defaultNow().notNull(),
  answers: jsonb('answers'),
});

export const metadata = pgTable('metadata', {
  key: varchar('key', { length: 100 }).primaryKey(),
  value: text('value').notNull(),
  type: varchar('type', { length: 20 }).default('string').notNull(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('passwordHash', { length: 255 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type Result = typeof results.$inferSelect;
export type NewResult = typeof results.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
