import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

const db = new Database('db/quiz.db', { readonly: true });

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const row = db.prepare('SELECT * FROM results WHERE id = ?').get(id);

    if (!row) {
      return NextResponse.json(
        { success: false, error: 'Resultado no encontrado' },
        { status: 404 }
      );
    }

    const parsed = {
      ...row,
      answers: JSON.parse(row.answers),
    };

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    console.error('Error fetching result:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener el resultado' },
      { status: 500 }
    );
  }
}
