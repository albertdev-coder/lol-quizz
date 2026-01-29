import Database from 'better-sqlite3';
import path from 'path';

/**
 * Database Singleton
 * Ensures only one database connection is created and reused
 */

// better-sqlite3 NO exporta tipos → usamos `any`
let db: any = null;

export function getDB() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'db', 'quiz.db');

    db = new Database(dbPath, {
      readonly: false,
      fileMustExist: false,
      timeout: 5000
    });

    // Optimize SQLite for better performance
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = NORMAL');
    db.pragma('cache_size = 10000');
    db.pragma('temp_store = MEMORY');
    db.pragma('foreign_keys = ON');

    if (process.env.NODE_ENV === 'development') {
      console.log(`[DB] Connected to SQLite database at ${dbPath}`);
    }
  }

  return db;
}

/**
 * Close database connection (for graceful shutdown)
 */
export function closeDB(): void {
  if (db) {
    db.close();
    db = null;

    if (process.env.NODE_ENV === 'development') {
      console.log('[DB] Database connection closed');
    }
  }
}

// Handle process termination
if (typeof process !== 'undefined') {
  process.on('exit', closeDB);
  process.on('SIGINT', () => {
    closeDB();
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    closeDB();
    process.exit(0);
  });
}
