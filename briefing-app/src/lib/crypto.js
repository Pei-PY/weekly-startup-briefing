/**
 * Browser-side decryption of public/data/briefings.enc.json (see scripts/encrypt-briefings.js).
 * Uses WebCrypto only; nothing leaves the browser. The derived key is kept in sessionStorage
 * so a page refresh in the same tab does not ask for the password again.
 */
const SESSION_KEY = 'briefings.key';

function b64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function bytesToB64(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

export async function fetchEncrypted() {
  const url = `${import.meta.env.BASE_URL}data/briefings.enc.json`;
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Could not load encrypted briefings (${res.status})`);
  return res.json();
}

async function deriveKeyBytes(password, env) {
  const enc = new TextEncoder();
  const base = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: b64ToBytes(env.salt), iterations: env.kdf.iterations, hash: env.kdf.hash },
    base,
    256,
  );
  return new Uint8Array(bits);
}

async function decryptWithKeyBytes(keyBytes, env) {
  const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, ['decrypt']);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64ToBytes(env.iv) }, key, b64ToBytes(env.data));
  return JSON.parse(new TextDecoder().decode(plain));
}

/** Try the key saved in this tab's session. Returns the briefings payload or null. */
export async function unlockFromSession(env) {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (!saved) return null;
    return await decryptWithKeyBytes(b64ToBytes(saved), env);
  } catch {
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
    return null;
  }
}

/** Derive the key from a password and decrypt. Throws on a wrong password. */
export async function unlockWithPassword(password, env) {
  const keyBytes = await deriveKeyBytes(password, env);
  const payload = await decryptWithKeyBytes(keyBytes, env); // throws OperationError if wrong
  try { sessionStorage.setItem(SESSION_KEY, bytesToB64(keyBytes)); } catch { /* private mode etc. */ }
  return payload;
}

export function lock() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
}
