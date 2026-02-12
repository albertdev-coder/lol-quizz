DO $$
BEGIN
  ALTER TYPE "public"."question_level" ADD VALUE IF NOT EXISTS 'Principiante';
  ALTER TYPE "public"."question_level" ADD VALUE IF NOT EXISTS 'Intermedio';
  ALTER TYPE "public"."question_level" ADD VALUE IF NOT EXISTS 'Avanzado';
  ALTER TYPE "public"."question_level" ADD VALUE IF NOT EXISTS 'Aprendiz';
  ALTER TYPE "public"."question_level" ADD VALUE IF NOT EXISTS 'Creyente';
  ALTER TYPE "public"."question_level" ADD VALUE IF NOT EXISTS 'Sabio';
  ALTER TYPE "public"."question_level" ADD VALUE IF NOT EXISTS 'Fan';
  ALTER TYPE "public"."question_level" ADD VALUE IF NOT EXISTS 'Entusiasta';
  ALTER TYPE "public"."question_level" ADD VALUE IF NOT EXISTS 'Otaku Mater.';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TYPE "public"."result_level" ADD VALUE IF NOT EXISTS 'Principiante';
  ALTER TYPE "public"."result_level" ADD VALUE IF NOT EXISTS 'Intermedio';
  ALTER TYPE "public"."result_level" ADD VALUE IF NOT EXISTS 'Avanzado';
  ALTER TYPE "public"."result_level" ADD VALUE IF NOT EXISTS 'Aprendiz';
  ALTER TYPE "public"."result_level" ADD VALUE IF NOT EXISTS 'Creyente';
  ALTER TYPE "public"."result_level" ADD VALUE IF NOT EXISTS 'Sabio';
  ALTER TYPE "public"."result_level" ADD VALUE IF NOT EXISTS 'Fan';
  ALTER TYPE "public"."result_level" ADD VALUE IF NOT EXISTS 'Entusiasta';
  ALTER TYPE "public"."result_level" ADD VALUE IF NOT EXISTS 'Otaku Mater.';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "results" ADD COLUMN IF NOT EXISTS "category" text;
UPDATE "results" SET "category" = COALESCE("category", 'ciencia');
ALTER TABLE "results" ALTER COLUMN "category" SET NOT NULL;

UPDATE "questions"
SET "level" = CASE
  WHEN "level"::text = 'principiante' THEN 'Principiante'::"question_level"
  WHEN "level"::text = 'intermedio' THEN 'Intermedio'::"question_level"
  WHEN "level"::text = 'avanzado' THEN 'Avanzado'::"question_level"
  WHEN "level"::text = 'aprendiz' THEN 'Aprendiz'::"question_level"
  WHEN "level"::text = 'creyente' THEN 'Creyente'::"question_level"
  WHEN "level"::text = 'sabio' THEN 'Sabio'::"question_level"
  WHEN "level"::text = 'fan' THEN 'Fan'::"question_level"
  WHEN "level"::text = 'entusiasta' THEN 'Entusiasta'::"question_level"
  WHEN "level"::text = 'otaku_mater' THEN 'Otaku Mater.'::"question_level"
  ELSE "level"
END;

UPDATE "results"
SET "level" = CASE
  WHEN "level"::text = 'principiante' THEN 'Principiante'::"result_level"
  WHEN "level"::text = 'intermedio' THEN 'Intermedio'::"result_level"
  WHEN "level"::text = 'avanzado' THEN 'Avanzado'::"result_level"
  WHEN "level"::text = 'aprendiz' THEN 'Aprendiz'::"result_level"
  WHEN "level"::text = 'creyente' THEN 'Creyente'::"result_level"
  WHEN "level"::text = 'sabio' THEN 'Sabio'::"result_level"
  WHEN "level"::text = 'fan' THEN 'Fan'::"result_level"
  WHEN "level"::text = 'entusiasta' THEN 'Entusiasta'::"result_level"
  WHEN "level"::text = 'otaku_mater' THEN 'Otaku Mater.'::"result_level"
  ELSE "level"
END;
