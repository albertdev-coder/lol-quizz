#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const QUESTIONS_PATH = join(__dirname, '../data/questions.json');
const METADATA_PATH = join(__dirname, '../data/metadata.json');

console.log('🔍 Validando preguntas del quiz...\n');

try {
  // Leer archivos
  const questionsData = JSON.parse(readFileSync(QUESTIONS_PATH, 'utf-8'));
  const metadataData = JSON.parse(readFileSync(METADATA_PATH, 'utf-8'));

  // Validar estructura básica
  if (!Array.isArray(questionsData)) {
    console.error('❌ Error: questions.json debe ser un array');
    process.exit(1);
  }

  // Validar IDs únicos
  const ids = questionsData.map(q => q.id);
  const uniqueIds = new Set(ids);
  const hasDuplicates = ids.length !== uniqueIds.size;

  if (hasDuplicates) {
    console.error('❌ Error: IDs duplicados encontrados');
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    console.error('   Duplicados:', [...new Set(duplicates)]);
    process.exit(1);
  }

  console.log(`✅ IDs únicos: ${uniqueIds.size} preguntas`);

  // Contar por nivel
  const levelCounts = {
    niño: 0,
    joven: 0,
    adulto: 0,
    mixto: 0,
  };

  questionsData.forEach(q => {
    levelCounts[q.level] = (levelCounts[q.level] || 0) + 1;
  });

  console.log('\n📊 Distribución por nivel:');
  console.log(`   Niño:   ${levelCounts.niño}`);
  console.log(`   Joven:  ${levelCounts.joven}`);
  console.log(`   Adulto: ${levelCounts.adulto}`);
  console.log(`   Mixto:  ${levelCounts.mixto}`);

  // Validar estructura de cada pregunta
  const invalidQuestions = [];
  
  questionsData.forEach((q, index) => {
    const issues = [];
    
    if (!q.id) issues.push('Missing id');
    if (!q.level) issues.push('Missing level');
    if (!['niño', 'joven', 'adulto', 'mixto'].includes(q.level)) {
      issues.push(`Invalid level: ${q.level}`);
    }
    if (!q.text || q.text.trim() === '') issues.push('Missing or empty text');
    if (!Array.isArray(q.choices) || q.choices.length !== 4) {
      issues.push('Invalid choices array (must have exactly 4 options)');
    }
    if (q.choices) {
      q.choices.forEach((choice, i) => {
        if (!choice || choice.trim() === '') {
          issues.push(`Empty choice at index ${i}`);
        }
      });
    }
    if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex > 3) {
      issues.push('Invalid correctIndex (must be 0-3)');
    }
    if (!q.explanation || q.explanation.trim() === '') {
      issues.push('Missing or empty explanation');
    }
    if (q.image !== null && typeof q.image !== 'string') {
      issues.push('Invalid image field (must be string or null)');
    }
    
    if (issues.length > 0) {
      invalidQuestions.push({ 
        index: index + 1,
        id: q.id || 'MISSING_ID', 
        issues 
      });
    }
  });

  if (invalidQuestions.length > 0) {
    console.error('\n❌ Preguntas con problemas estructurales:');
    invalidQuestions.forEach(({ index, id, issues }) => {
      console.error(`   [${index}] ${id}:`);
      issues.forEach(issue => console.error(`      - ${issue}`));
    });
    process.exit(1);
  }

  console.log('\n✅ Todas las preguntas tienen estructura válida');

  // Validar coherencia con metadata
  if (metadataData.totalQuestions !== questionsData.length) {
    console.warn('\n⚠️  Advertencia: El total en metadata no coincide con el número de preguntas');
    console.warn(`   Metadata: ${metadataData.totalQuestions}`);
    console.warn(`   Actual: ${questionsData.length}`);
  }

  if (metadataData.levels.niño !== levelCounts.niño ||
      metadataData.levels.joven !== levelCounts.joven ||
      metadataData.levels.adulto !== levelCounts.adulto) {
    console.warn('\n⚠️  Advertencia: La distribución por niveles no coincide con metadata');
    console.warn('   Metadata:', metadataData.levels);
    console.warn('   Actual:', { niño: levelCounts.niño, joven: levelCounts.joven, adulto: levelCounts.adulto });
  } else {
    console.log('\n✅ Metadata coherente con las preguntas');
  }

  // Validar total esperado
  if (questionsData.length !== 30) {
    console.warn(`\n⚠️  Advertencia: Se esperan 30 preguntas, pero hay ${questionsData.length}`);
  } else {
    console.log('\n✅ Total de preguntas correcto: 30');
  }

  // Resumen final
  console.log('\n' + '='.repeat(50));
  console.log('✅ VALIDACIÓN EXITOSA');
  console.log('='.repeat(50));
  console.log(`Total de preguntas: ${questionsData.length}`);
  console.log(`IDs únicos: ${uniqueIds.size}`);
  console.log(`Preguntas válidas: ${questionsData.length - invalidQuestions.length}`);
  console.log('='.repeat(50) + '\n');

} catch (error) {
  console.error('❌ Error al validar preguntas:', error.message);
  process.exit(1);
}
