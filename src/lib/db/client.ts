import 'server-only';

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required to connect to PostgreSQL');
}

declare global {
  var __quizPgPool: Pool | undefined;
}

const pool = global.__quizPgPool ?? new Pool({ connectionString });

if (process.env.NODE_ENV !== 'production') {
  global.__quizPgPool = pool;
}

export const db = drizzle(pool, { schema });

export async function closeDbConnection(): Promise<void> {
  await pool.end();
}
