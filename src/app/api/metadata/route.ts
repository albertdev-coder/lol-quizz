import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import type { NextRequest } from 'next/server';

const METADATA_PATH = path.join(process.cwd(), 'data', 'metadata.json');

async function readMetadata<T>(): Promise<T> {
  const raw = await fs.readFile(METADATA_PATH, 'utf-8');
  return JSON.parse(raw) as T;
}

export async function GET(_request: NextRequest) {
  try {
    const metadata = await readMetadata<any>();

    return NextResponse.json({
      success: true,
      data: metadata,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener metadata',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
