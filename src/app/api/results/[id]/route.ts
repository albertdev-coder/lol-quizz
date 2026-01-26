import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

const db = new Database('db/quiz.db');

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const result = db.prepare('SELECT * FROM results WHERE id = ?').get(id);

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Resultado no encontrado' },
        { status: 404 }
      );
    }

    // Parsear el campo answers de JSON a objeto
    const parsedResult = {
      ...result,
      answers: JSON.parse(result.answers),
    };

    return NextResponse.json({
      success: true,
      data: parsedResult,
    });
  } catch (error) {
    console.error('Error fetching result:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener el resultado' },
      { status: 500 }
    );
  }
}
