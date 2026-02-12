import { eq, inArray, sql } from 'drizzle-orm';
import { db, closeDbConnection } from './client';
import { categories, metadata, questions } from './schema';

const baseCategories = [
  { id: 'ciencia', slug: 'ciencia', name: 'Ciencia', description: 'Preguntas de ciencia general para todos los niveles.' },
  { id: 'otaku', slug: 'otaku', name: 'Otaku', description: 'Preguntas de anime y cultura otaku.' },
  { id: 'teologia', slug: 'teologia', name: 'Teología', description: 'Preguntas religiosas y de teología.' },
] as const;

const extraQuestions = [
  { id: 'q-901', categoryId: 'otaku', level: 'niño' as const, text: '¿Cómo se llama la criatura eléctrica más famosa de Pokémon?', choices: ['Charmander', 'Bulbasaur', 'Pikachu', 'Eevee'], correctIndex: 2, explanation: 'Pikachu es el compañero principal de Ash en la saga Pokémon.', image: null },
  { id: 'q-902', categoryId: 'otaku', level: 'joven' as const, text: '¿Qué anime sigue la historia de Monkey D. Luffy buscando el One Piece?', choices: ['Naruto', 'One Piece', 'Bleach', 'Fairy Tail'], correctIndex: 1, explanation: 'One Piece narra el viaje de Luffy para convertirse en Rey de los Piratas.', image: null },
  { id: 'q-903', categoryId: 'otaku', level: 'adulto' as const, text: '¿Qué estudio produjo la película “El viaje de Chihiro”?', choices: ['Toei Animation', 'Madhouse', 'Studio Ghibli', 'MAPPA'], correctIndex: 2, explanation: 'Studio Ghibli produjo la película ganadora del Óscar “El viaje de Chihiro”.', image: null },
  { id: 'q-904', categoryId: 'teologia', level: 'niño' as const, text: '¿Cuál es el nombre del libro sagrado del cristianismo?', choices: ['Torá', 'Biblia', 'Corán', 'Vedas'], correctIndex: 1, explanation: 'La Biblia es el texto sagrado central del cristianismo.', image: null },
  { id: 'q-905', categoryId: 'teologia', level: 'joven' as const, text: '¿Qué significa la palabra “teología” en su sentido general?', choices: ['Estudio de la tierra', 'Estudio de Dios', 'Estudio del lenguaje', 'Estudio de los números'], correctIndex: 1, explanation: 'Teología es la disciplina que estudia a Dios y lo relacionado con lo divino.', image: null },
  { id: 'q-906', categoryId: 'teologia', level: 'adulto' as const, text: '¿Cómo se conoce la rama que busca justificar racionalmente la fe?', choices: ['Hermenéutica', 'Patrística', 'Apologética', 'Escatología'], correctIndex: 2, explanation: 'La apologética presenta fundamentos racionales y defensas de la fe.', image: null },
] as const;

async function runSeed() {
  await db.insert(categories).values(baseCategories).onConflictDoNothing();

  const existingQuestionIds = await db
    .select({ id: questions.id })
    .from(questions)
    .where(inArray(questions.id, extraQuestions.map((q) => q.id)));

  const existingSet = new Set(existingQuestionIds.map((q) => q.id));
  const missingQuestions = extraQuestions.filter((q) => !existingSet.has(q.id));

  if (missingQuestions.length > 0) {
    await db.insert(questions).values(missingQuestions as any);
  }

  const [scienceCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(questions)
    .where(eq(questions.categoryId, 'ciencia'));

  const countByLevel = await db
    .select({ level: questions.level, count: sql<number>`count(*)::int` })
    .from(questions)
    .where(eq(questions.categoryId, 'ciencia'))
    .groupBy(questions.level);

  const levels = countByLevel.reduce(
    (acc, row) => ({ ...acc, [row.level]: row.count }),
    {} as Record<string, number>
  );

  const metadataRows = [
    { key: 'category', value: 'Ciencia', type: 'string' },
    { key: 'totalQuestions', value: String(scienceCount?.count ?? 0), type: 'number' },
    { key: 'levels', value: JSON.stringify(levels), type: 'json' },
    { key: 'generatedAt', value: new Date().toISOString(), type: 'string' },
    { key: 'topics', value: JSON.stringify(['astronomía', 'biología', 'física', 'química']), type: 'json' },
    { key: 'version', value: '2.0.0', type: 'string' },
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
