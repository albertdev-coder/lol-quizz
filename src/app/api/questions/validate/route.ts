import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

const db = new Database('db/quiz.db', { readonly: true });

export async function GET() {
  try {
    const questions = db.prepare('SELECT * FROM questions').all();

    // Parse choices
    const parsedQuestions = questions.map(q => ({
      ...q,
      choices: JSON.parse(q.choices),
    }));

    // Load metadata from SQLite
    const metadataRows = db.prepare('SELECT key, value, type FROM metadata').all();
    const metadata: any = {};

    metadataRows.forEach(row => {
      if (row.type === 'json') metadata[row.key] = JSON.parse(row.value);
      else if (row.type === 'number') metadata[row.key] = Number(row.value);
      else metadata[row.key] = row.value;
    });

    // Validate unique IDs
    const ids = parsedQuestions.map(q => q.id);
    const uniqueIds = new Set(ids);
    const hasDuplicates = ids.length !== uniqueIds.size;
    const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);

    // Validate level distribution
    const levelCounts: Record<string, number> = { niño: 0, joven: 0, adulto: 0 };
    parsedQuestions.forEach(q => {
      if (q.level !== 'mixto') {
        levelCounts[q.level] = (levelCounts[q.level] || 0) + 1;
      }
    });

    // Validate structure
    const invalidQuestions: Array<{ id: string; issues: string[] }> = [];

    parsedQuestions.forEach(q => {
      const issues: string[] = [];

      if (!q.id) issues.push('Missing id');
      if (!q.level) issues.push('Missing level');
      if (!q.text) issues.push('Missing text');

      if (!Array.isArray(q.choices) || q.choices.length !== 4) {
        issues.push('Invalid choices array (must have 4 options)');
      }

      if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex > 3) {
        issues.push('Invalid correctIndex (must be 0-3)');
      }

      if (!q.explanation) issues.push('Missing explanation');

      if (issues.length > 0) invalidQuestions.push({ id: q.id, issues });
    });

    // Validate metadata
    const metadataValid =
      metadata.totalQuestions === parsedQuestions.length &&
      metadata.levels.niño === levelCounts.niño &&
      metadata.levels.joven === levelCounts.joven &&
      metadata.levels.adulto === levelCounts.adulto;

    const allValid =
      !hasDuplicates &&
      invalidQuestions.length === 0 &&
      metadataValid;

    return NextResponse.json({
      success: true,
      valid: allValid,
      summary: {
        totalQuestions: parsedQuestions.length,
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
        correctCount: parsedQuestions.length === metadata.totalQuestions,
        validStructure: invalidQuestions.length === 0,
        metadataMatch: metadataValid,
      },
    });
  } catch (error: any) {
    console.error('Error validating questions:', error);
    return NextResponse.json(
      { success: false, error: 'Error al validar las preguntas', details: error.message },
      { status: 500 }
    );
  }
}
