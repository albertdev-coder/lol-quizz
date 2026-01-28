import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Database from 'better-sqlite3';
import { QuizResult } from '@/types/quiz';

// Conexión a la base de datos (lectura/escritura)
const db = new Database('db/quiz.db', { fileMustExist: true });

/* -------------------------------------------------------
   POST → Guardar resultado del quiz
-------------------------------------------------------- */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validación básica
    if (!body.level || typeof body.score !== 'number' || !body.answers) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos: level, score y answers son requeridos' },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.answers) || body.answers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'El campo answers debe ser un array no vacío' },
        { status: 422 }
      );
    }

    // Construcción del resultado
    const result: QuizResult = {
      id: `result-${Date.now()}`,
      level: body.level,
      score: body.score,
      totalQuestions: body.totalQuestions || body.answers.length,
      correctAnswers:
        body.correctAnswers ??
        body.answers.filter((a: any) => a.isCorrect).length,
      incorrectAnswers:
        body.incorrectAnswers ??
        body.answers.filter((a: any) => !a.isCorrect).length,
      timeSpent: body.timeSpent || 0,
      answers: body.answers,
      date: new Date().toISOString(),
    };

    // Inserción en SQLite
    db.prepare(
      `
      INSERT INTO results (
        id, level, score, totalQuestions, correctAnswers,
        incorrectAnswers, timeSpent, date, answers
      )
      VALUES (
        @id, @level, @score, @totalQuestions, @correctAnswers,
        @incorrectAnswers, @timeSpent, @date, @answers
      )
    `
    ).run({
      ...result,
      answers: JSON.stringify(result.answers),
    });

    return NextResponse.json({
      success: true,
      message: 'Resultado guardado correctamente',
      data: {
        id: result.id,
        timestamp: result.date,
        score: result.score,
        level: result.level,
      },
    });
  } catch (error: any) {
    console.error('Error saving quiz results:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al guardar el resultado',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/* -------------------------------------------------------
   GET → Obtener resultados guardados
-------------------------------------------------------- */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const level = searchParams.get('level');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const sortBy = searchParams.get('sortBy') || 'date';

    let query = 'SELECT * FROM results';
    const params: any[] = [];

    // Filtro por nivel
    if (level && level !== 'mixto') {
      query += ' WHERE level = ?';
      params.push(level);
    }

    // Ordenamiento
    query += sortBy === 'score'
      ? ' ORDER BY score DESC'
      : ' ORDER BY date DESC';

    // Límite
    query += ' LIMIT ?';
    params.push(limit);

    const rows = db.prepare(query).all(...params);

    const results = rows.map((r: any) => ({
      ...r,
      answers: JSON.parse(r.answers),
    }));

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
      showing: results.length,
      filters: { level: level || 'all', limit, sortBy },
    });
  } catch (error: any) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener los resultados',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
