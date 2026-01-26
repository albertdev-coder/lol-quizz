// scripts/init-db.mjs
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db', 'quiz.db');
const db = new Database(dbPath);

console.log('🔧 Initializing database schema...\n');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// -------------------------------------------------------------
// DROP OLD TABLES (to avoid schema mismatch errors)
// -------------------------------------------------------------
console.log('⚠️ Dropping old tables to ensure correct schema...');
db.exec(`DROP TABLE IF EXISTS questions`);
db.exec(`DROP TABLE IF EXISTS results`);
db.exec(`DROP TABLE IF EXISTS metadata`);

// -------------------------------------------------------------
// CREATE QUESTIONS TABLE
// -------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    level TEXT NOT NULL,
    text TEXT NOT NULL,
    choices TEXT NOT NULL, -- JSON array
    correctIndex INTEGER NOT NULL CHECK(correctIndex >= 0 AND correctIndex <= 3),
    explanation TEXT,
    image TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_questions_level ON questions(level);
  CREATE INDEX IF NOT EXISTS idx_questions_created ON questions(createdAt);
`);

console.log('✅ Questions table created');

// -------------------------------------------------------------
// CREATE RESULTS TABLE
// -------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS results (
    id TEXT PRIMARY KEY,
    level TEXT NOT NULL,
    score REAL NOT NULL CHECK(score >= 0 AND score <= 100),
    totalQuestions INTEGER NOT NULL CHECK(totalQuestions > 0),
    correctAnswers INTEGER NOT NULL CHECK(correctAnswers >= 0),
    incorrectAnswers INTEGER NOT NULL CHECK(incorrectAnswers >= 0),
    timeSpent INTEGER DEFAULT 0,
    date TEXT NOT NULL,
    answers TEXT NOT NULL, -- JSON array
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_results_level ON results(level);
  CREATE INDEX IF NOT EXISTS idx_results_date ON results(date DESC);
  CREATE INDEX IF NOT EXISTS idx_results_score ON results(score DESC);
  CREATE INDEX IF NOT EXISTS idx_results_created ON results(createdAt DESC);
`);

console.log('✅ Results table created');

// -------------------------------------------------------------
// CREATE METADATA TABLE
// -------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('string', 'number', 'json', 'boolean')),
    description TEXT,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_metadata_updated ON metadata(updatedAt);
`);

console.log('✅ Metadata table created');

// -------------------------------------------------------------
// MIGRATE METADATA.JSON → METADATA TABLE
// -------------------------------------------------------------
const metadataPath = path.join(process.cwd(), 'data', 'metadata.json');

if (fs.existsSync(metadataPath)) {
  console.log('\n📦 Migrating metadata.json into metadata table...');

  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

  const insertMeta = db.prepare(`
    INSERT OR REPLACE INTO metadata (key, value, type, description, updatedAt)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);

  const tx = db.transaction((data) => {
    insertMeta.run('category', data.category, 'string', 'Quiz category');
    insertMeta.run('totalQuestions', data.totalQuestions.toString(), 'number', 'Total number of questions');
    insertMeta.run('version', data.version, 'string', 'Quiz version');
    insertMeta.run('generatedAt', data.generatedAt, 'string', 'Generation date');
    insertMeta.run('levels', JSON.stringify(data.levels), 'json', 'Distribution by level');
    insertMeta.run('topics', JSON.stringify(data.topics), 'json', 'Quiz topics');
  });

  tx(metadata);

  console.log('✅ Metadata migrated successfully');
} else {
  console.log('⚠️ metadata.json not found — skipping migration');
}

// -------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------
const questionsCount = db.prepare('SELECT COUNT(*) as count FROM questions').get().count;
const resultsCount = db.prepare('SELECT COUNT(*) as count FROM results').get().count;
const metadataCount = db.prepare('SELECT COUNT(*) as count FROM metadata').get().count;

console.log('\n📊 Database Statistics:');
console.log(`  Questions: ${questionsCount}`);
console.log(`  Results: ${resultsCount}`);
console.log(`  Metadata entries: ${metadataCount}`);

console.log('\n📑 Indexes:');
['questions', 'results', 'metadata'].forEach(table => {
  const indexes = db.prepare(`PRAGMA index_list(${table})`).all();
  console.log(`  ${table}: ${indexes.length} indexes`);
});

db.close();
console.log('\n✨ Database initialization complete!\n');
