/**
 * Script de limpieza de carpetas demo
 * Elimina carpetas innecesarias del proyecto Zoer demo
 */

import { rmSync, existsSync } from 'fs';
import { join } from 'path';

const foldersToRemove = [
  'src/app/login',
  'src/app/zoer_proxy',
  'src/app/next_api',
  'src/components/auth'
];

console.log('🧹 Limpiando carpetas demo...\n');

foldersToRemove.forEach(folder => {
  const folderPath = join(process.cwd(), folder);
  
  if (existsSync(folderPath)) {
    try {
      rmSync(folderPath, { recursive: true, force: true });
      console.log(`✅ Eliminado: ${folder}`);
    } catch (error) {
      console.error(`❌ Error eliminando ${folder}:`, error.message);
    }
  } else {
    console.log(`ℹ️  No existe: ${folder}`);
  }
});

console.log('\n✨ Limpieza completada!\n');
