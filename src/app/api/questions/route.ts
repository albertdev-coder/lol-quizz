import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import type { NextRequest } from 'next/server';

// Reuse DB connection (Next.js keeps module in memory)
const db = new Database('db/quiz.db', { readonly: true });

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const count = parseInt(searchParams.get('count') || '10', 10);

    let query = 'SELECT * FROM questions';
    const params: any[] = [];

    if (level && level.toLowerCase() !== 'mixto') {
      query += ' WHERE level = ?';
      params.push(level);
    }

    const rows = db.prepare(query).all(...params);

    // Parse JSON fields
    const questions = rows.map(q => ({
      ...q,
      choices: JSON.parse(q.choices),
    }));

    // Shuffle
    const shuffled = [...questions].sort(() => Math.random() - 0.5);

    // Limit
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    return NextResponse.json({
      success: true,
      data: selected,
      total: selected.length,
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener las preguntas' },
      { status: 500 }
    );
  }
}
