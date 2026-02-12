import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

export const questionLevelEnum = pgEnum('question_level', [
  'principiante',
  'intermedio',
  'avanzado',
  'aprendiz',
  'creyente',
  'sabio',
  'fan',
  'entusiasta',
  'otaku_mater',
]);
export const resultLevelEnum = pgEnum('result_level', [
  'principiante',
  'intermedio',
  'avanzado',
  'aprendiz',
  'creyente',
  'sabio',
  'fan',
  'entusiasta',
  'otaku_mater',
]);

export const categories = pgTable(
  'categories',
  {
    id: text('id').primaryKey(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('categories_slug_unique').on(table.slug)]
);

export const questions = pgTable(
  'questions',
  {
    id: text('id').primaryKey(),
    categoryId: text('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
    text: text('text').notNull(),
    level: questionLevelEnum('level').notNull(),
    choices: jsonb('choices').$type<string[]>().notNull(),
    correctIndex: integer('correct_index').notNull(),
    explanation: text('explanation'),
    image: text('image'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('questions_level_idx').on(table.level),
    index('questions_category_level_idx').on(table.categoryId, table.level),
  ]
);

export const results = pgTable(
  'results',
  {
    id: text('id').primaryKey(),
    category: text('category').notNull(),
    level: resultLevelEnum('level').notNull(),
    score: integer('score').notNull(),
    totalQuestions: integer('total_questions').notNull(),
    correctAnswers: integer('correct_answers').notNull(),
    incorrectAnswers: integer('incorrect_answers').notNull(),
    timeSpent: integer('time_spent').notNull(),
    date: timestamp('date', { withTimezone: true }).notNull(),
    answers: jsonb('answers').$type<unknown[]>().notNull(),
  },
  (table) => [index('results_date_idx').on(table.date), index('results_score_idx').on(table.score)]
);

export const metadata = pgTable('metadata', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  type: text('type').notNull(),
});
