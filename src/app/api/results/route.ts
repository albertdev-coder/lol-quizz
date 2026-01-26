import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Database from 'better-sqlite3';
import { QuizResult } from '@/types/quiz';

const db = new Database('db/quiz.db');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos básicos
    if (!body.level || typeof body.score !== 'number' || !body.answers) {
      return NextResponse.json(
        { success: false, error: 'Datos inválidos: level, score, answers requeridos' },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.answers) || body.answers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'El campo answers debe ser un array no vacío' },
        { status: 422 }
      );
    }

    // Crear objeto de resultado
    const result: QuizResult = {
      id: `result-${Date.now()}`,
      totalQuestions: body.totalQuestions || body.answers.length,
      correctAnswers: body.correctAnswers ?? body.answers.filter((a: any) => a.isCorrect).length,
      incorrectAnswers: body.incorrectAnswers ?? body.answers.filter((a: any) => !a.isCorrect).length,
      score: body.score,
      timeSpent: body.timeSpent || 0,
      level: body.level,
      answers: body.answers,
      date: new Date().toISOString(),
    };

    // Insertar en SQLite
    db.prepare(`
      INSERT INTO results (id, level, score, totalQuestions, correctAnswers, incorrectAnswers, timeSpent, date, answers)
      VALUES (@id, @level, @score, @totalQuestions, @correctAnswers, @incorrectAnswers, @timeSpent, @date, @answers)
    `).run({
      ...result,
      answers: JSON.stringify(result.answers),
    });

    console.log('Quiz result saved:', {
      level: result.level,
      score: result.score,
      questions: result.totalQuestions,
      correct: result.correctAnswers,
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
  } catch (error) {
    console.error('Error saving quiz results:', error);
    return NextResponse.json(
      { success: false, error: 'Error al guardar el resultado', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const sortBy = searchParams.get('sortBy') || 'date'; // date, score

    let query = 'SELECT * FROM results';
    const params: any[] = [];

    if (level && level !== 'mixto') {
      query += ' WHERE level = ?';
      params.push(level);
    }

    if (sortBy === 'score') {
      query += ' ORDER BY score DESC';
    } else {
      query += ' ORDER BY date DESC';
    }

    query += ' LIMIT ?';
    params.push(limit);

    const results = db.prepare(query).all(...params);

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
      showing: results.length,
      filters: { level: level || 'all', limit, sortBy },
    });
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener los resultados', details: error.message },
      { status: 500 }
    );
  }
}
