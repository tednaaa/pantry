import { mkdir, readdir } from 'node:fs/promises';
import { join, parse } from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const SOURCE = 'raw-photos';
const OUTPUT = 'public';
const FOLDERS = ['dishes', 'products'];
const SIZE = 600;
const QUALITY = 80;

let converted = 0;

for (const folder of FOLDERS) {
  const from = join(SOURCE, folder);
  const to = join(OUTPUT, folder);

  let files: string[] = [];

  try {
    files = (await readdir(from)).filter(file => /\.(?:jpe?g|png|heic|webp)$/i.test(file));
  }
  catch {
    continue;
  }

  await mkdir(to, { recursive: true });

  for (const file of files) {
    const { name } = parse(file);

    await sharp(join(from, file))
      .rotate()
      .resize(SIZE, SIZE, { fit: 'cover', position: 'centre' })
      .webp({ quality: QUALITY })
      .toFile(join(to, `${name}.webp`));

    converted += 1;
    console.log(`✓ ${folder}/${name}.webp`);
  }
}

if (converted === 0) {
  console.error(`Положи исходники в ${SOURCE}/dishes и ${SOURCE}/products, назвав файлы идентификаторами.`);
  process.exit(1);
}
