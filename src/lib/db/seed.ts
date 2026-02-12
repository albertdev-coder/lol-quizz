import { eq, inArray, sql } from 'drizzle-orm';
import { closeDbConnection, db } from '@/lib/db/client';
import { categories, metadata, questions } from '@/lib/db/schema';
import { CATEGORY_CONFIG, CATEGORY_LIST } from '@/constants/quiz-categories';

type SeedLevel = (typeof CATEGORY_LIST)[number]['levels'][number]['level'];

const baseCategories = CATEGORY_LIST.map((category) => ({
  id: category.id,
  slug: category.id,
  name: category.title,
  description: category.description,
}));

const TOPICS: Record<string, string[]> = {
  ciencia: ['física', 'biología', 'astronomía', 'química'],
  teologia: ['historia bíblica', 'doctrina', 'ética', 'exégesis'],
  anime: ['shōnen', 'personajes', 'estudios', 'tramas'],
};

function buildQuestionText(categoryId: string, level: SeedLevel, index: number): string {
  if (categoryId === 'ciencia') return `Pregunta ${index} de ciencia (${level}): ¿Cuál concepto explica mejor este fenómeno?`;
  if (categoryId === 'teologia') return `Pregunta ${index} de teología (${level}): ¿Qué afirmación representa mejor este tema?`;
  return `Pregunta ${index} de anime (${level}): ¿Cuál opción coincide con la referencia planteada?`;
}

function buildQuestionChoices(categoryId: string): string[] {
  if (categoryId === 'ciencia') return ['Hipótesis', 'Evidencia empírica', 'Mito popular', 'Suposición'];
  if (categoryId === 'teologia') return ['Interpretación contextual', 'Lectura aislada', 'Tradición oral', 'Opinión personal'];
  return ['Escena canónica', 'Dato inventado', 'Fanfic', 'Rumor'];
}

function buildExplanation(categoryId: string, level: SeedLevel): string {
  if (categoryId === 'ciencia') return `En nivel ${level}, se prioriza la comprensión del método científico y el análisis crítico.`;
  if (categoryId === 'teologia') return `En nivel ${level}, se evalúa comprensión doctrinal, contexto histórico y reflexión ética.`;
  return `En nivel ${level}, se evalúa memoria de obras, personajes y coherencia narrativa del anime.`;
}

function createQuestions() {
  const questionsPerLevel = 40;
  let id = 1;

  return CATEGORY_LIST.flatMap((category) =>
    category.levels.flatMap((level) =>
      Array.from({ length: questionsPerLevel }).map((_, index) => {
        const questionId = `q-${String(id).padStart(3, '0')}`;
        id += 1;

        return {
          id: questionId,
          categoryId: category.id,
          level: level.level,
          text: buildQuestionText(category.id, level.level, index + 1),
          choices: buildQuestionChoices(category.id),
          correctIndex: 1,
          explanation: buildExplanation(category.id, level.level),
          image: null,
        };
      })
    )
  );
}

async function runSeed() {
  await db.insert(categories).values(baseCategories).onConflictDoNothing();

  const seededQuestions = createQuestions();
  const ids = seededQuestions.map((question) => question.id);

  await db.delete(questions).where(inArray(questions.id, ids));
  await db.insert(questions).values(seededQuestions as any);

  const categorySummary = await Promise.all(
    CATEGORY_LIST.map(async (category) => {
      const [totalRow] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(questions)
        .where(eq(questions.categoryId, category.id));

      const levelRows = await db
        .select({ level: questions.level, count: sql<number>`count(*)::int` })
        .from(questions)
        .where(eq(questions.categoryId, category.id))
        .groupBy(questions.level);

      return {
        category: category.id,
        totalQuestions: totalRow?.count ?? 0,
        levels: levelRows.reduce<Record<string, number>>((acc, row) => {
          acc[row.level] = row.count;
          return acc;
        }, {}),
        topics: TOPICS[category.id],
      };
    })
  );

  const metadataRows = [
    { key: 'categoriesSummary', value: JSON.stringify(categorySummary), type: 'json' },
    { key: 'generatedAt', value: new Date().toISOString(), type: 'string' },
    { key: 'version', value: '3.0.0', type: 'string' },
  ];

  for (const row of metadataRows) {
    await db
      .insert(metadata)
      .values(row)
      .onConflictDoUpdate({ target: metadata.key, set: { value: row.value, type: row.type } });
  }
}

runSeed()
  .then(async () => {
    console.log('✅ Seed completado');
    await closeDbConnection();
  })
  .catch(async (error) => {
    console.error('❌ Error en seed:', error);
    await closeDbConnection();
    process.exit(1);
  });
