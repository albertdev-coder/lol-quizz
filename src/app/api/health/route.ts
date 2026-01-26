import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import fs from 'fs/promises';
import path from 'path';
import type { NextRequest } from 'next/server';

const db = new Database('db/quiz.db');
const METADATA_PATH = path.join(process.cwd(), 'data', 'metadata.json');

async function readJSON<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

export async function GET(_request: NextRequest) {
  try {
    // Contar preguntas desde SQLite
    const totalQuestions = db.prepare('SELECT COUNT(*) as count FROM questions').get().count;

    // Leer metadata desde archivo
    const metadata = await readJSON<any>(METADATA_PATH);

    return NextResponse.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      data: {
        totalQuestions,
        metadata,
      },
    });
  } catch (error) {
    console.error('Error in health check:', error);
    return NextResponse.json(
      {
        success: false,
        status: 'unhealthy',
        error: 'Error checking health status',
      },
      { status: 500 }
    );
  }
}
