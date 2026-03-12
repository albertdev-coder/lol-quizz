import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';

let pool: postgres.Sql<{}> | null = null;
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getPool() {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    pool = postgres(databaseUrl, { 
      max: 20,
      idle_timeout: 20,
      connect_timeout: 2000,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('[DB] Connected to PostgreSQL database');
    }
  }

  return pool;
}

export function getDB() {
  if (!db) {
    const pool = getPool();
    db = drizzle(pool, { schema });
  }

  return db;
}

export function getPoolConnection() {
  return getPool();
}

export async function closeDB(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    db = null;

    if (process.env.NODE_ENV === 'development') {
      console.log('[DB] Database connection closed');
    }
  }
}
