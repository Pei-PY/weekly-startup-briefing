/**
 * Company identity helpers shared by the briefing parser and the duplicate checker.
 *
 * Two briefing entries describe the same company when their normalized names (or a
 * parenthetical alias such as "SoBanHang (Finan)") match, or when they link the same
 * identifying website domain.
 */

// Legal-form tokens that carry no identity: "Katalon Inc", "PT Xurya", "Aonic Sdn Bhd".
const LEGAL_TOKENS = new Set([
  'inc', 'llc', 'ltd', 'limited', 'corp', 'corporation', 'co', 'company',
  'gmbh', 'sas', 'pbc', 'plc', 'pte', 'pt', 'sdn', 'bhd', 'jsc', 'tbk',
]);

// Descriptive tokens that two spellings of one company often differ by ("Pints" / "Pints AI").
// Used only for the "possible duplicate" review match, never for automatic removal.
const GENERIC_TOKENS = new Set([
  'ai', 'app', 'asia', 'digital', 'global', 'group', 'holdings', 'io', 'lab', 'labs',
  'software', 'solutions', 'studio', 'studios', 'systems', 'tech', 'technologies', 'technology',
]);

// Domains that identify a platform, investor or publisher rather than the company itself.
const NON_IDENTIFYING_DOMAINS = [
  '500.co', 'antler.co', 'apple.com', 'crunchbase.com', 'dealstreetasia.com', 'e27.co', 'facebook.com',
  'iterative.vc',
  'github.com', 'google.com', 'instagram.com', 'linkedin.com', 'medium.com', 'notion.site',
  'notion.so', 'pitchbook.com', 'producthunt.com', 'substack.com', 'techinasia.com',
  'tracxn.com', 'twitter.com', 'x.com', 'ycombinator.com', 'youtube.com',
];

export function normalizeCompanyName(name) {
  if (!name) return '';
  const normalized = String(name)
    .replace(/\([^)]*\)/g, ' ')          // drop parenthetical aliases and notes
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')     // strip accents: "Thế" -> "The"
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

  const parts = normalized.split(' ').filter(Boolean);
  while (parts.length > 1 && LEGAL_TOKENS.has(parts[parts.length - 1])) parts.pop();
  while (parts.length > 1 && LEGAL_TOKENS.has(parts[0])) parts.shift();
  return parts.join(' ');
}

/** Normalized name with generic words removed — for "possible duplicate" review matches only. */
export function looseCompanyName(name) {
  const normalized = normalizeCompanyName(name);
  const parts = normalized.split(' ').filter(part => !GENERIC_TOKENS.has(part));
  return parts.join(' ') || normalized;
}

/** Normalized primary name plus every parenthetical alias: "SoBanHang (Finan)" -> ["sobanhang", "finan"]. */
export function extractNameAliases(name) {
  const aliases = [];
  const primary = normalizeCompanyName(name);
  if (primary) aliases.push(primary);

  for (const match of String(name ?? '').matchAll(/\(([^)]+)\)/g)) {
    const alias = normalizeCompanyName(match[1].replace(/^(?:formerly|fka|aka|now|ex)\s+/i, ''));
    if (alias) aliases.push(alias);
  }
  return [...new Set(aliases)];
}

export function normalizeDomain(urlOrDomain) {
  if (!urlOrDomain) return null;
  const raw = String(urlOrDomain).trim();
  if (!raw) return null;

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    try {
      parsed = new URL(`https://${raw}`);
    } catch {
      return null;
    }
  }

  return parsed.hostname
    .toLowerCase()
    .replace(/^www\./, '')
    .replace(/\.$/, '') || null;
}

/**
 * The website domain when it identifies the company; null for investor/platform links
 * such as "[Antler Disrupt 2025 portfolio](https://www.antler.co/...)".
 */
export function identifyingDomain(urlOrDomain, displayText = null) {
  if (displayText && /\s/.test(String(displayText).trim())) return null;
  const domain = normalizeDomain(urlOrDomain);
  if (!domain || !domain.includes('.')) return null;
  const blocked = NON_IDENTIFYING_DOMAINS.some(d => domain === d || domain.endsWith(`.${d}`));
  return blocked ? null : domain;
}

export function buildCompanyKey(name, websiteUrl) {
  const normalizedName = normalizeCompanyName(name);
  const domain = normalizeDomain(websiteUrl) ?? 'no-domain';
  return `${normalizedName}|${domain}`;
}

/** True when two alias lists share at least one normalized name. */
export function sameCompany(aliasesA, aliasesB) {
  return aliasesA.some(alias => aliasesB.includes(alias));
}
