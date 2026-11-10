/**
 * Encrypts src/data/briefings.json -> public/data/briefings.enc.json so the published
 * site carries no readable briefing data. The browser derives the same key from the
 * password the visitor types (see src/lib/crypto.js) and decrypts in memory.
 *
 *   BRIEFING_PASSWORD=... node scripts/encrypt-briefings.js
 *
 * Scheme: PBKDF2-SHA256 (250,000 iterations, 16-byte random salt) -> 256-bit key,
 * AES-256-GCM with a 12-byte random IV. The password is never written to disk.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomBytes, pbkdf2Sync, createCipheriv } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const INPUT = join(__dirname, '../src/data/briefings.json');
const OUT_DIR = join(__dirname, '../public/data');
const OUTPUT = join(OUT_DIR, 'briefings.enc.json');

export const KDF = { iterations: 250000, hash: 'sha256', keyLength: 32 };

const password = process.env.BRIEFING_PASSWORD;
if (!password) {
  console.error('✗ BRIEFING_PASSWORD is not set. Export it before building, e.g.\n' +
    '    BRIEFING_PASSWORD=yourpassword npm run build');
  process.exit(1);
}

const plaintext = readFileSync(INPUT);
const salt = randomBytes(16);
const iv = randomBytes(12);
const key = pbkdf2Sync(password, salt, KDF.iterations, KDF.keyLength, KDF.hash);
const cipher = createCipheriv('aes-256-gcm', key, iv);
const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final(), cipher.getAuthTag()]);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUTPUT, JSON.stringify({
  v: 1,
  kdf: { name: 'PBKDF2', hash: 'SHA-256', iterations: KDF.iterations },
  cipher: 'AES-GCM',
  salt: salt.toString('base64'),
  iv: iv.toString('base64'),
  data: ciphertext.toString('base64'),
}));
console.log(`✓ Encrypted ${plaintext.length.toLocaleString()} bytes -> ${OUTPUT}`);
