import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import type { NextRequest } from 'next/server';

const db = new Database('db/quiz.db', { readonly: true });

export async function GET(_request: NextRequest) {
  try {
    // Contar preguntas desde SQLite
    const totalQuestions = db
      .prepare('SELECT COUNT(*) as count FROM questions')
      .get().count;

    // Leer metadata desde SQLite
    const rows = db.prepare('SELECT key, value, type FROM metadata').all();

    const metadata: any = {};
    rows.forEach(row => {
      if (row.type === 'json') metadata[row.key] = JSON.parse(row.value);
      else if (row.type === 'number') metadata[row.key] = Number(row.value);
      else if (row.type === 'boolean') metadata[row.key] = row.value === 'true';
      else metadata[row.key] = row.value;
    });

    return NextResponse.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      data: {
        totalQuestions,
        metadata,
      },
    });
  } catch (error: any) {
    console.error('Error in health check:', error);
    return NextResponse.json(
      {
        success: false,
        status: 'unhealthy',
        error: 'Error checking health status',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
