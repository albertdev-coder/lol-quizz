// scripts/inspect-db.mjs
import Database from 'better-sqlite3';

const db = new Database('db/quiz.db');

// Get all tables
const tables = db.prepare(`
  SELECT name FROM sqlite_master 
  WHERE type='table' AND name NOT LIKE 'sqlite_%'
`).all();

console.log('\n=== Database Schema ===\n');
console.log('Tables:', tables.map(t => t.name).join(', '));

// Get schema for each table
tables.forEach(table => {
  console.log(`\n--- ${table.name} ---`);
  const schema = db.prepare(`PRAGMA table_info(${table.name})`).all();
  schema.forEach(col => {
    console.log(`  ${col.name}: ${col.type}${col.notnull ? ' NOT NULL' : ''}${col.pk ? ' PRIMARY KEY' : ''}`);
  });
  
  // Get indexes
  const indexes = db.prepare(`PRAGMA index_list(${table.name})`).all();
  if (indexes.length > 0) {
    console.log('  Indexes:', indexes.map(idx => idx.name).join(', '));
  }
  
  // Get count
  const count = db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get();
  console.log(`  Rows: ${count.count}`);
});

db.close();
