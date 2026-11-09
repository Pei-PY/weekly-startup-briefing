#!/usr/bin/env node
/**
 * Cross-briefing duplicate check for briefings/*.md.
 *
 * Rule: a company appears in the briefing series once. Its earliest appearance is canonical;
 * any appearance in a later briefing (or later in the same briefing) is a duplicate.
 *
 *   node scripts/dedupe-briefings.js                   report duplicates; exit 1 if any
 *   node scripts/dedupe-briefings.js --fix             remove the later duplicate sections, fix the Summary /
 *                                                      Vertical Coverage tables, note the removal in the header
 *   node scripts/dedupe-briefings.js --lookup A [B..]  show earlier coverage of a company name or domain
 *                                                      (exit 1 when covered, 0 when not)
 *
 * Matching: normalized name or parenthetical alias (strict); same website domain plus a name
 * that differs only by generic words such as "AI" (strict). A shared domain with a different
 * name, or a similar name alone, is reported for review and never removed automatically.
 */
import { readFileSync, writeFileSync } from 'fs';
import { basename, join } from 'path';
import { fileURLToPath } from 'url';
import { BRIEFINGS_DIR, SECTION_SEPARATOR, listBriefingFiles, parseBriefingContent } from './briefing-parser.js';
import {
  extractNameAliases, identifyingDomain, looseCompanyName, normalizeCompanyName, sameCompany,
} from './company-key.js';

/** One record per "### N. Company" section across every briefing, oldest briefing first. */
export function loadEntries(briefingsDir = BRIEFINGS_DIR) {
  const entries = [];
  for (const filename of listBriefingFiles(briefingsDir)) {
    const filePath = join(briefingsDir, filename);
    const { companies } = parseBriefingContent(readFileSync(filePath, 'utf8'));
    for (const company of companies) {
      entries.push({
        date: filename.replace('-briefing.md', ''),
        filename,
        filePath,
        rank: company.rank,
        name: company.name,
        vertical: company.vertical,
        aliases: extractNameAliases(company.name),
        loose: looseCompanyName(company.name),
        domain: identifyingDomain(company.websiteUrl, company.websiteDisplay),
      });
    }
  }
  return entries;
}

function matchReason(entry, canonical) {
  const alias = entry.aliases.find(a => canonical.aliases.includes(a));
  if (alias) return { strict: true, reason: `same name "${alias}"` };
  const sameDomain = Boolean(entry.domain) && entry.domain === canonical.domain;
  const similarName = entry.loose.length >= 3 && entry.loose === canonical.loose;
  if (sameDomain && similarName) return { strict: true, reason: `similar name "${entry.loose}" + same website ${entry.domain}` };
  // A shared domain alone is not proof: portfolio companies are often listed under their investor's site.
  if (sameDomain) return { strict: false, reason: `same website ${entry.domain}, different name` };
  if (similarName) return { strict: false, reason: `similar name "${entry.loose}"` };
  return null;
}

/** Walk entries oldest-first; the first appearance of a company is canonical, later ones are duplicates. */
export function findDuplicates(entries) {
  const canonical = [];
  const duplicates = [];
  const reviews = [];

  for (const entry of entries) {
    let strictHit = null;
    let looseHit = null;
    for (const c of canonical) {
      const match = matchReason(entry, c);
      if (!match) continue;
      if (match.strict) { strictHit = { canonical: c, reason: match.reason }; break; }
      looseHit ??= { canonical: c, reason: match.reason };
    }

    if (strictHit) {
      duplicates.push({ entry, ...strictHit });
      // Let later spellings/domains of this company resolve to the same canonical entry.
      strictHit.canonical.aliases = [...new Set([...strictHit.canonical.aliases, ...entry.aliases])];
      strictHit.canonical.domain ??= entry.domain;
      continue;
    }
    if (looseHit) reviews.push({ entry, ...looseHit });
    canonical.push({ ...entry, aliases: [...entry.aliases] });
  }
  return { duplicates, reviews };
}

/** Earlier coverage of a company name ("Amity", "SoBanHang (Finan)") or website domain ("amity.co"). */
export function lookup(entries, term) {
  const aliases = extractNameAliases(term);
  const loose = looseCompanyName(term);
  const domain = term.includes('.') ? identifyingDomain(term) : null;
  return entries.filter(e => sameCompany(aliases, e.aliases)
    || (domain && e.domain === domain)
    || (loose.length >= 3 && e.loose === loose));
}

const label = e => `${e.date} #${e.rank} ${e.name}`;

function printReport({ duplicates, reviews }, entries) {
  const fileCount = new Set(entries.map(e => e.filename)).size;
  console.log(`Duplicate check: ${entries.length} companies across ${fileCount} briefings`);

  if (duplicates.length === 0) {
    console.log('✓ No company appears in more than one briefing.');
  } else {
    const files = new Set(duplicates.map(d => d.entry.filename));
    console.log(`✗ ${duplicates.length} duplicate section(s) in ${files.size} briefing(s) — the earliest appearance is kept:\n`);
    const groups = new Map();
    for (const d of duplicates) {
      const key = label(d.canonical);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(d);
    }
    for (const [first, items] of groups) {
      console.log(`  ${first}`);
      for (const d of items) console.log(`    ↳ remove ${label(d.entry)}  (${d.reason})`);
    }
  }

  if (reviews.length) {
    console.log(`\n? ${reviews.length} possible duplicate(s) to review by hand (not touched by --fix):`);
    for (const r of reviews) console.log(`  ${label(r.entry)}  ~  ${label(r.canonical)}  (${r.reason})`);
  }
}

// ---------------------------------------------------------------------------
// --fix: edit the markdown of a briefing that contains duplicates
// ---------------------------------------------------------------------------

const stripCellMarkup = cell => cell.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*/g, '').trim();
const cells = line => line.split('|').slice(1, -1).map(c => c.trim());
const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Split "A, B (x, y), C" into ["A", "B (x, y)", "C"]. */
function splitTopLevelCommas(text) {
  const out = [];
  let depth = 0;
  let current = '';
  for (const ch of text) {
    if (ch === '(') depth += 1;
    else if (ch === ')') depth = Math.max(0, depth - 1);
    if (ch === ',' && depth === 0) { out.push(current.trim()); current = ''; } else current += ch;
  }
  if (current.trim()) out.push(current.trim());
  return out.filter(Boolean);
}

/** Does a table cell such as "**Mintlify**", "SoBanHang (Finan)" or "Synera ($58M total — …)" name this company? */
function cellNames(target, text) {
  const clean = stripCellMarkup(text);
  const aliases = extractNameAliases(clean);
  const head = normalizeCompanyName(clean.split('(')[0]);
  if (head && !aliases.includes(head)) aliases.push(head);
  return sameCompany(target.aliases, aliases)
    || (target.loose.length >= 3 && aliases.some(a => looseCompanyName(a) === target.loose));
}

/** Locate the first markdown table after a heading; returns inclusive line indexes or null. */
function findTable(lines, headingRe) {
  const heading = lines.findIndex(l => headingRe.test(l));
  if (heading === -1) return null;
  let i = heading + 1;
  while (i < lines.length && !lines[i].startsWith('|') && !lines[i].startsWith('## ')) i += 1;
  if (i >= lines.length || !lines[i].startsWith('|')) return null;
  const first = i;
  while (i < lines.length && lines[i].startsWith('|')) i += 1;
  return { first, last: i - 1 }; // first = header row, first + 1 = separator row
}

function editSummaryTable(lines, targets, warnings) {
  const table = findTable(lines, /^## Summary Table/);
  if (!table) { warnings.push('no Summary Table in this file — nothing to update there'); return lines; }
  const dataStart = table.first + 2;
  const matched = new Set();
  const kept = [];
  for (let i = dataStart; i <= table.last; i += 1) {
    const row = cells(lines[i]);
    const hit = row.length > 1 && targets.find(t => !matched.has(t) && cellNames(t, row[1]));
    if (hit) { matched.add(hit); continue; }
    kept.push(lines[i]);
  }
  for (const t of targets) if (!matched.has(t)) warnings.push(`Summary Table: no row for "${t.name}" — remove it by hand`);
  let n = 0;
  const renumbered = kept.map(line => (/^\|\s*\d+\s*\|/.test(line) ? line.replace(/^\|\s*\d+\s*\|/, () => `| ${++n} |`) : line));
  return [...lines.slice(0, dataStart), ...renumbered, ...lines.slice(table.last + 1)];
}

const normalizeVertical = v => String(v ?? '').replace(/\([^)]*\)/g, ' ').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const verticalMatches = (rowVertical, companyVertical) => {
  const a = normalizeVertical(rowVertical);
  const b = normalizeVertical(companyVertical);
  return Boolean(a) && Boolean(b) && (a === b || a.startsWith(b) || b.startsWith(a));
};

/**
 * Decrement the Vertical Coverage row of each removed company. The row is found by the company
 * name when the table lists every company, or by the company's vertical when the table lists
 * only the top company per vertical. Rows that reach zero are dropped.
 */
function editVerticalCoverage(lines, targets, warnings) {
  const table = findTable(lines, /^## Vertical Coverage/);
  if (!table) { warnings.push('no Vertical Coverage table in this file — nothing to update there'); return lines; }
  const out = [...lines];
  const drop = new Set();
  const liveRows = () => {
    const rows = [];
    for (let i = table.first + 2; i <= table.last; i += 1) if (!drop.has(i)) rows.push(i);
    return rows;
  };

  for (const t of targets) {
    let hit = null;
    for (const i of liveRows()) {
      const row = cells(out[i]);
      if (row.length < 3) continue;
      const names = splitTopLevelCommas(row[2]);
      const idx = names.findIndex(nm => cellNames(t, nm));
      if (idx !== -1) { names.splice(idx, 1); hit = { i, names }; break; }
    }
    if (!hit && t.vertical) {
      for (const i of liveRows()) {
        const row = cells(out[i]);
        if (row.length < 3 || !verticalMatches(row[0], t.vertical)) continue;
        hit = { i, names: splitTopLevelCommas(row[2]) };
        warnings.push(`Vertical Coverage: "${t.name}" is not named in the table — decremented the "${row[0]}" row by vertical instead`);
        break;
      }
    }
    if (!hit) { warnings.push(`Vertical Coverage: "${t.name}" not listed — check the table and the "no coverage" note by hand`); continue; }

    const row = cells(out[hit.i]);
    const count = /^\d+$/.test(row[1]) ? Number(row[1]) - 1 : null;
    if (count !== null && count <= 0) { drop.add(hit.i); continue; }
    if (hit.names.length === 0) warnings.push(`Vertical Coverage: "${row[0]}" still counts ${count ?? row[1]} after removing ${t.name} but names no other company — check by hand`);
    out[hit.i] = `| ${row[0]} | ${count ?? row[1]} | ${hit.names.join(', ') || '—'} |`;
  }
  return out.filter((_, i) => !drop.has(i));
}

/** Record the removal in the briefing's header blockquote so the shorter list explains itself. */
function addHeaderNote(lines, removed, warnings) {
  const first = lines.findIndex(l => l.startsWith('> '));
  if (first === -1) { warnings.push('no header blockquote found — duplicate-removal note not added'); return lines; }
  let last = first;
  while (last + 1 < lines.length && lines[last + 1].startsWith('> ')) last += 1;
  const today = new Date().toISOString().slice(0, 10);
  const items = removed.map(t => `${t.name} (first covered ${t.firstDate ?? 'in an earlier briefing'})`).join(', ');
  const note = `> *Duplicate check (${today}): removed ${items} — each company appears in the briefing series once.*`;
  return [...lines.slice(0, last + 1), note, ...lines.slice(last + 1)];
}

function residualMentions(lines, target) {
  const plain = target.name.replace(/\s*\([^)]*\)\s*$/, '').trim();
  if (!plain) return [];
  const re = new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(plain)}(?![\\p{L}\\p{N}])`, 'iu');
  const hits = [];
  lines.forEach((line, i) => { if (!line.startsWith('> *Duplicate check') && re.test(line)) hits.push(i + 1); });
  return hits;
}

/**
 * Remove the given companies ({ name, rank, vertical?, firstDate? }) from one briefing's markdown:
 * drop their sections, renumber the remaining "### N." headings, fix the Summary Table ranks and
 * the Vertical Coverage counts, add a dated note to the header, and report anything that still
 * needs a human.
 */
export function removeFromBriefing(content, removals) {
  const bom = content.startsWith('﻿') ? '﻿' : '';
  const crlf = content.includes('\r\n');
  const text = content.slice(bom.length).replace(/\r\n/g, '\n');
  const warnings = [];
  const targets = removals.map(r => ({
    ...r, aliases: extractNameAliases(r.name), loose: looseCompanyName(r.name), removed: false,
  }));

  // 1. Drop the company sections, then renumber the ones that remain.
  const kept = [];
  for (const part of text.split(SECTION_SEPARATOR)) {
    const heading = part.trim().match(/^###\s+(\d+)\.\s+(.+)/);
    const candidates = heading
      ? targets.filter(t => !t.removed && sameCompany(t.aliases, extractNameAliases(heading[2])))
      : [];
    const hit = candidates.find(t => t.rank === Number(heading[1])) ?? candidates[0];
    if (hit) {
      hit.removed = true;
      const tail = part.search(/\n## /); // keep a "## Summary Table" block that shares this chunk
      if (tail !== -1) kept.push(part.slice(tail));
      continue;
    }
    kept.push(part);
  }
  for (const t of targets) if (!t.removed) warnings.push(`section "### ${t.rank}. ${t.name}" not found — nothing removed for it`);

  let n = 0;
  const renumbered = kept.map(part => part.replace(/^(\s*)###\s+\d+\.\s+/, (_, ws) => `${ws}### ${++n}. `));
  let lines = renumbered.join(SECTION_SEPARATOR).split('\n');

  // 2. Tables, header note, leftover mentions.
  const removed = targets.filter(t => t.removed);
  if (removed.length) {
    lines = editSummaryTable(lines, removed, warnings);
    lines = editVerticalCoverage(lines, removed, warnings);
    lines = addHeaderNote(lines, removed, warnings);
    for (const t of removed) {
      const hits = residualMentions(lines, t);
      if (hits.length) warnings.push(`"${t.name}" is still mentioned on line(s) ${hits.join(', ')} (intro notes, trends or sources) — edit by hand if needed`);
    }
  }

  const joined = lines.join('\n');
  return { content: bom + (crlf ? joined.replace(/\n/g, '\r\n') : joined), removedCount: removed.length, warnings };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function main(argv) {
  const args = argv.slice(2);
  const entries = loadEntries();

  const lookupAt = args.indexOf('--lookup');
  if (lookupAt !== -1) {
    const terms = args.slice(lookupAt + 1).filter(a => !a.startsWith('--'));
    if (terms.length === 0) {
      console.error('Usage: node scripts/dedupe-briefings.js --lookup "Company name" [domain.com ...]');
      process.exit(2);
    }
    let covered = false;
    for (const term of terms) {
      const hits = lookup(entries, term);
      if (hits.length) { covered = true; console.log(`Covered: "${term}" → ${hits.map(label).join('; ')}`); } else console.log(`No prior coverage: "${term}"`);
    }
    process.exit(covered ? 1 : 0);
  }

  const result = findDuplicates(entries);
  printReport(result, entries);
  if (!args.includes('--fix')) process.exit(result.duplicates.length ? 1 : 0);
  if (result.duplicates.length === 0) process.exit(0);

  const byFile = new Map();
  for (const d of result.duplicates) {
    if (!byFile.has(d.entry.filePath)) byFile.set(d.entry.filePath, []);
    byFile.get(d.entry.filePath).push({
      name: d.entry.name, rank: d.entry.rank, vertical: d.entry.vertical, firstDate: d.canonical.date,
    });
  }
  console.log('');
  for (const [filePath, removals] of byFile) {
    const { content, removedCount, warnings } = removeFromBriefing(readFileSync(filePath, 'utf8'), removals);
    writeFileSync(filePath, content);
    console.log(`✎ ${basename(filePath)}: removed ${removedCount} section(s)`);
    for (const w of warnings) console.log(`  ⚠ ${w}`);
  }

  const after = findDuplicates(loadEntries());
  if (after.duplicates.length) {
    console.log(`\n✗ ${after.duplicates.length} duplicate(s) remain:`);
    for (const d of after.duplicates) console.log(`  ${label(d.entry)}  ←  ${label(d.canonical)}  (${d.reason})`);
    process.exit(1);
  }
  console.log('\n✓ Re-check passed: no duplicates remain. Run `npm run parse` to refresh src/data/briefings.json.');
}

if (basename(fileURLToPath(import.meta.url)) === basename(process.argv[1] ?? '')) {
  main(process.argv);
}
