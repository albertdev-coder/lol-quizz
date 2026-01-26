/**
 * Script para generar iconos PWA
 * Este script genera iconos PNG simples para la PWA usando SVG
 * Ejecutar con: node scripts/generate-icons.mjs
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

function generateSVGIcon(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#9333ea;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#c026d3;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Fondo con gradiente -->
  <rect width="${size}" height="${size}" fill="url(#grad)"/>
  
  <!-- Círculo blanco semitransparente -->
  <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.4}" fill="#ffffff" opacity="0.2"/>
  
  <!-- Átomo: órbitas -->
  <g transform="translate(${size / 2}, ${size / 2})">
    <ellipse cx="0" cy="0" rx="${size * 0.375}" ry="${size * 0.12}" 
             fill="none" stroke="#ffffff" stroke-width="${size * 0.03}" stroke-linecap="round"/>
    <ellipse cx="0" cy="0" rx="${size * 0.375}" ry="${size * 0.12}" 
             fill="none" stroke="#ffffff" stroke-width="${size * 0.03}" stroke-linecap="round"
             transform="rotate(60)"/>
    <ellipse cx="0" cy="0" rx="${size * 0.375}" ry="${size * 0.12}" 
             fill="none" stroke="#ffffff" stroke-width="${size * 0.03}" stroke-linecap="round"
             transform="rotate(120)"/>
  </g>
  
  <!-- Núcleo central -->
  <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.075}" fill="#ffffff"/>
  
  <!-- Electrones -->
  <circle cx="${size / 2 + size * 0.375}" cy="${size / 2}" 
          r="${size * 0.06}" fill="#fbbf24" stroke="#ffffff" stroke-width="${size * 0.015}"/>
  <circle cx="${size / 2 - size * 0.1875}" cy="${size / 2 + size * 0.325}" 
          r="${size * 0.06}" fill="#fbbf24" stroke="#ffffff" stroke-width="${size * 0.015}"/>
  <circle cx="${size / 2 - size * 0.1875}" cy="${size / 2 - size * 0.325}" 
          r="${size * 0.06}" fill="#fbbf24" stroke="#ffffff" stroke-width="${size * 0.015}"/>
</svg>`;
}

console.log('🎨 Generando iconos PWA...\n');

sizes.forEach(size => {
  const svg = generateSVGIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = join(process.cwd(), 'public', 'icons', filename);
  
  writeFileSync(filepath, svg);
  console.log(`✅ Generado: ${filename}`);
});

console.log('\n✨ ¡Iconos SVG generados exitosamente!');
console.log('📝 Nota: Los navegadores modernos soportan SVG en PWAs.');
console.log('   Si necesitas PNG, abre public/icons/generate-icons.html en tu navegador.\n');
