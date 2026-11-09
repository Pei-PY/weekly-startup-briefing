/**
 * briefings/YYYY-MM-DD-briefing.md  ->  src/data/briefings.json
 * Run via `npm run parse`; `npm run build` runs it after the duplicate check.
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { BRIEFINGS_DIR, listBriefingFiles, parseBriefingFile } from './briefing-parser.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '../src/data');
const OUTPUT_PATH = join(OUTPUT_DIR, 'briefings.json');

// oldest-first: sidebar starts with the earliest report (April 15), then June 21, ...
const briefings = listBriefingFiles().map(filename => {
  const date = filename.replace('-briefing.md', '');
  console.log(`Parsing ${filename}...`);
  return { date, ...parseBriefingFile(join(BRIEFINGS_DIR, filename)) };
});

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_PATH, JSON.stringify({ briefings }, null, 2));
console.log(`✓ Wrote ${briefings.length} briefings (${briefings.reduce((s, b) => s + b.companies.length, 0)} companies) to ${OUTPUT_PATH}`);
