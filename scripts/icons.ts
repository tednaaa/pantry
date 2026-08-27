import { Buffer } from 'node:buffer';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const BACKGROUND = '#0b0b0c';
const BRAND = '#1677ff';
const SIZE = 512;
const STROKE = 40;

function logo(cornerRadius: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" rx="${cornerRadius}" fill="${BACKGROUND}"/>
  <g fill="none" stroke="${BRAND}" stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round">
    <rect x="136" y="196" width="240" height="216" rx="40"/>
    <path d="M196 196v-24a60 60 0 0 1 120 0v24"/>
  </g>
</svg>
`;
}

const rounded = Buffer.from(logo(112));
const square = Buffer.from(logo(0));

await mkdir('public/icons', { recursive: true });
await writeFile('public/favicon.svg', rounded);

const targets = [
  { source: rounded, size: 192, file: 'icons/192.png' },
  { source: rounded, size: 512, file: 'icons/512.png' },
  { source: square, size: 512, file: 'icons/maskable-512.png' },
  { source: square, size: 180, file: 'apple-touch-icon.png' },
];

for (const { source, size, file } of targets) {
  await sharp(source).resize(size, size).png().toFile(join('public', file));
  console.log(`✓ ${file}`);
}
