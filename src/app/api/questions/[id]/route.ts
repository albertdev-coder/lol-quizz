import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

const db = new Database('db/quiz.db');

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const question = db.prepare('SELECT * FROM questions WHERE id = ?').get(id);

    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Pregunta no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: question });
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener la pregunta' },
      { status: 500 }
    );
  }
}
