import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import type { NextRequest } from 'next/server';

const db = new Database('db/quiz.db', { readonly: true });

export async function GET(_request: NextRequest) {
  try {
    // Leer metadata desde SQLite
    const rows = db.prepare(`
      SELECT key, value, type
      FROM metadata
    `).all();

    const metadata: any = {};

    // Reconstruir objeto metadata
    rows.forEach((row: any) => {
      if (row.type === 'json') {
        metadata[row.key] = JSON.parse(row.value);
      } else if (row.type === 'number') {
        metadata[row.key] = Number(row.value);
      } else if (row.type === 'boolean') {
        metadata[row.key] = row.value === 'true';
      } else {
        metadata[row.key] = row.value;
      }
    });

    return NextResponse.json({
      success: true,
      data: metadata,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error fetching metadata:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener metadata',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
