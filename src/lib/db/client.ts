import 'dotenv/config'; // <- esto carga automáticamente .env
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Usamos DATABASE_URL directamente
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required to connect to PostgreSQL');
}

// Singleton pool para desarrollo
declare global {
  var __quizPgPool: Pool | undefined;
}
const pool = global.__quizPgPool ?? new Pool({ connectionString });

if (process.env.NODE_ENV !== 'production') {
  global.__quizPgPool = pool;
}

// Exportamos la DB
export const db = drizzle(pool, { schema });

// Función opcional para cerrar conexión
export async function closeDbConnection(): Promise<void> {
  await pool.end();
}
