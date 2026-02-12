CREATE TYPE "public"."question_level" AS ENUM('niño', 'joven', 'adulto');
CREATE TYPE "public"."result_level" AS ENUM('niño', 'joven', 'adulto', 'mixto');

CREATE TABLE "categories" (
  "id" text PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "questions" (
  "id" text PRIMARY KEY NOT NULL,
  "category_id" text NOT NULL,
  "text" text NOT NULL,
  "level" "question_level" NOT NULL,
  "choices" jsonb NOT NULL,
  "correct_index" integer NOT NULL,
  "explanation" text,
  "image" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "results" (
  "id" text PRIMARY KEY NOT NULL,
  "level" "result_level" NOT NULL,
  "score" integer NOT NULL,
  "total_questions" integer NOT NULL,
  "correct_answers" integer NOT NULL,
  "incorrect_answers" integer NOT NULL,
  "time_spent" integer NOT NULL,
  "date" timestamp with time zone NOT NULL,
  "answers" jsonb NOT NULL
);

CREATE TABLE "metadata" (
  "key" text PRIMARY KEY NOT NULL,
  "value" text NOT NULL,
  "type" text NOT NULL
);

ALTER TABLE "questions" ADD CONSTRAINT "questions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE cascade;

CREATE UNIQUE INDEX "categories_slug_unique" ON "categories" USING btree ("slug");
CREATE INDEX "questions_level_idx" ON "questions" USING btree ("level");
CREATE INDEX "questions_category_level_idx" ON "questions" USING btree ("category_id", "level");
CREATE INDEX "results_date_idx" ON "results" USING btree ("date");
CREATE INDEX "results_score_idx" ON "results" USING btree ("score");

INSERT INTO "categories" ("id", "slug", "name", "description") VALUES
('ciencia', 'ciencia', 'Ciencia', 'Preguntas de ciencia general para todos los niveles.'),
('otaku', 'otaku', 'Otaku', 'Preguntas de anime y cultura otaku.'),
('teologia', 'teologia', 'Teología', 'Preguntas religiosas y de teología.')
ON CONFLICT ("id") DO NOTHING;
