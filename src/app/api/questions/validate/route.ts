import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import metadata from '@/data/metadata.json';

const db = new Database('db/quiz.db');

export async function GET() {
  try {
    const questions = db.prepare('SELECT * FROM questions').all();

    // Validar IDs únicos
    const ids = questions.map(q => q.id);
    const uniqueIds = new Set(ids);
    const hasDuplicates = ids.length !== uniqueIds.size;
    const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);

    // Validar cantidad por nivel
    const levelCounts: Record<string, number> = { niño: 0, joven: 0, adulto: 0 };
    questions.forEach(q => {
      if (q.level !== 'mixto') {
        levelCounts[q.level] = (levelCounts[q.level] || 0) + 1;
      }
    });

    // Validar estructura
    const invalidQuestions: Array<{ id: string; issues: string[] }> = [];
    questions.forEach(q => {
      const issues: string[] = [];
      if (!q.id) issues.push('Missing id');
      if (!q.level) issues.push('Missing level');
      if (!q.text) issues.push('Missing text');
      const choices = JSON.parse(q.choices);
      if (!Array.isArray(choices) || choices.length !== 4) {
        issues.push('Invalid choices array (must have 4 options)');
      }
      if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex > 3) {
        issues.push('Invalid correctIndex (must be 0-3)');
      }
      if (!q.explanation) issues.push('Missing explanation');
      if (issues.length > 0) invalidQuestions.push({ id: q.id, issues });
    });

    // Validar metadata
    const metadataValid =
      metadata.totalQuestions === questions.length &&
      metadata.levels.niño === levelCounts.niño &&
      metadata.levels.joven === levelCounts.joven &&
      metadata.levels.adulto === levelCounts.adulto;

    const allValid =
      !hasDuplicates &&
      invalidQuestions.length === 0 &&
      metadataValid &&
      questions.length === metadata.totalQuestions;

    return NextResponse.json({
      success: true,
      valid: allValid,
      summary: {
        totalQuestions: questions.length,
        expectedQuestions: metadata.totalQuestions,
        uniqueIds: uniqueIds.size,
        hasDuplicates,
        duplicates: duplicates.length > 0 ? duplicates : undefined,
      },
      levelDistribution: levelCounts,
      expectedDistribution: metadata.levels,
      metadataValid,
      invalidQuestions: invalidQuestions.length > 0 ? invalidQuestions : undefined,
      checks: {
        uniqueIds: !hasDuplicates,
        correctCount: questions.length === metadata.totalQuestions,
        validStructure: invalidQuestions.length === 0,
        metadataMatch: metadataValid,
      },
    });
  } catch (error) {
    console.error('Error validating questions:', error);
    return NextResponse.json(
      { success: false, error: 'Error al validar las preguntas', details: error.message },
      { status: 500 }
    );
  }
}
