import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

const db = new Database('db/quiz.db', { readonly: true });

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    const row = db.prepare('SELECT * FROM questions WHERE id = ?').get(id);

    if (!row) {
      return NextResponse.json(
        { success: false, error: 'Pregunta no encontrada' },
        { status: 404 }
      );
    }

    const question = {
      ...row,
      choices: JSON.parse(row.choices),
    };

    return NextResponse.json({ success: true, data: question });
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener la pregunta' },
      { status: 500 }
    );
  }
}
