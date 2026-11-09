/**
 * Markdown briefing parser — pure functions shared by parse-briefings.js (JSON export)
 * and dedupe-briefings.js (cross-briefing duplicate check).
 */
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { buildCompanyKey } from './company-key.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const BRIEFINGS_DIR = join(__dirname, '../../briefings');
export const BRIEFING_FILE_RE = /^\d{4}-\d{2}-\d{2}-briefing\.md$/;
/** Company sections (and the surrounding header/summary blocks) are separated by a lone "---" line. */
export const SECTION_SEPARATOR = '\n---\n';

/** Briefing filenames sorted oldest first. */
export function listBriefingFiles(dir = BRIEFINGS_DIR) {
  return readdirSync(dir).filter(f => BRIEFING_FILE_RE.test(f)).sort();
}

function parseCurrencyToM(str) {
  // Prefer parenthetical USD: €40M (~$43M) -> 43
  const parenMatch = str.match(/\(~?\$(\d+\.?\d*)([MK])\)/);
  if (parenMatch) {
    const v = parseFloat(parenMatch[1]);
    return parenMatch[2] === 'K' ? v / 1000 : v;
  }
  const usdMatch = str.match(/~?\$(\d+\.?\d*)([MK])/);
  if (usdMatch) {
    const v = parseFloat(usdMatch[1]);
    return usdMatch[2] === 'K' ? v / 1000 : v;
  }
  const euroMatch = str.match(/~?€(\d+\.?\d*)([MK])/);
  if (euroMatch) {
    const v = parseFloat(euroMatch[1]);
    return euroMatch[2] === 'K' ? v / 1000 : v;
  }
  return null;
}

const BIGTECH_SIGNALS = [
  { label: 'ex-Google',    re: /\b(?:ex-Google(?:Brain| Brain)?|from Google|Google alum|formerly at Google)\b/i },
  { label: 'ex-DeepMind',  re: /\b(?:ex-DeepMind|from DeepMind|DeepMind alum)\b/i },
  { label: 'ex-Meta',      re: /\b(?:ex-Meta|ex-Facebook|from Meta|from Facebook|Meta alum)\b/i },
  { label: 'ex-NVIDIA',    re: /\b(?:ex-NVIDIA|ex-Nvidia|from NVIDIA|from Nvidia|NVIDIA VP|Nvidia VP|NVIDIA alum)\b/i },
  { label: 'ex-Microsoft', re: /\b(?:ex-Microsoft|from Microsoft|Microsoft alum|Microsoft Research)\b/i },
  { label: 'ex-Amazon',    re: /\b(?:ex-Amazon|from Amazon|ex-AWS|from AWS|Amazon alum)\b/i },
  { label: 'ex-Apple',     re: /\b(?:ex-Apple|from Apple|Apple alum)\b/i },
  { label: 'ex-OpenAI',    re: /\b(?:ex-OpenAI|from OpenAI|OpenAI alum)\b/i },
  { label: 'ex-Anthropic', re: /\b(?:ex-Anthropic|from Anthropic)\b/i },
  { label: 'ex-ByteDance', re: /\b(?:ex-ByteDance|ex-TikTok|from ByteDance|from TikTok)\b/i },
  { label: 'ex-Tencent',   re: /\b(?:ex-Tencent|from Tencent|Tencent AI Lab|Tencent.*Lab)\b/i },
  { label: 'ex-Alibaba',   re: /\b(?:ex-Alibaba|from Alibaba|ex-Ant Group|from Ant Group)\b/i },
  { label: 'ex-Baidu',     re: /\b(?:ex-Baidu|from Baidu|Baidu Research)\b/i },
  { label: 'ex-Grab',      re: /\b(?:ex-Grab|from Grab|Grab alum)\b/i },
  { label: 'ex-Gojek',     re: /\b(?:ex-Gojek|from Gojek)\b/i },
  { label: 'ex-Sea',       re: /\b(?:ex-Sea(?:\b| Ltd| Group)|from Sea(?:\b| Ltd| Group)|ex-Shopee|ex-Garena)\b/i },
  { label: 'ex-Uber',      re: /\b(?:ex-Uber|from Uber|Uber alum)\b/i },
  { label: 'ex-Intel',     re: /\b(?:ex-Intel|from Intel|Intel alum)\b/i },
  { label: 'ex-Qualcomm',  re: /\b(?:ex-Qualcomm|from Qualcomm)\b/i },
  { label: 'ex-Tesla',     re: /\b(?:ex-Tesla|from Tesla)\b/i },
  { label: 'ex-SpaceX',    re: /\b(?:ex-SpaceX|from SpaceX)\b/i },
  { label: 'ex-Goldman',   re: /\b(?:ex-Goldman|from Goldman Sachs)\b/i },
  { label: 'ex-McKinsey',  re: /\b(?:ex-McKinsey|from McKinsey)\b/i },
];

const SERIAL_SIGNALS = [
  /\bserial founder\b/i,
  /\brepeat founder\b/i,
  /\bsecond[- ]time founder\b/i,
  /\bunicorn founder\b/i,
  /\bex-unicorn founder\b/i,
  /\bpreviously founded\b/i,
  /\btook it public\b/i,
  /\bfounder.*\btook.*public\b/i,
  /\btook.*public.*\bfounder\b/i,
  /\bfounder.*\bacquired by\b/i,
  /\bacquired by.*\bfounder\b/i,
];

const COUNTRY_PATTERNS = [
  { code: 'sg', name: 'Singapore',   re: /\bSingapore\b/i },
  { code: 'my', name: 'Malaysia',    re: /\bMalaysia\b|\bKuala Lumpur\b|\bKL\b/i },
  { code: 'vn', name: 'Vietnam',     re: /\bVietnam\b|\bVietnamese\b|\bHanoi\b|\bHo Chi Minh\b|\bHCMC\b/i },
  { code: 'id', name: 'Indonesia',   re: /\bIndonesia\b|\bIndonesian\b|\bJakarta\b/i },
  { code: 'ph', name: 'Philippines', re: /\bPhilippines\b|\bPhilippine\b|\bFilipino\b|\bManila\b/i },
  { code: 'th', name: 'Thailand',    re: /\bThailand\b|\bThai\b|\bBangkok\b/i },
];

function extractCountry(fields) {
  const text = [
    fields['What we do'] ?? '',
    fields["Today's interesting article"] ?? '',
  ].join(' ');

  for (const c of COUNTRY_PATTERNS) {
    if (c.re.test(text)) return { code: c.code, name: c.name };
  }
  return null;
}

function extractFounderBackground(fields) {
  const text = [
    fields['What we do'] ?? '',
    fields["Today's interesting article"] ?? '',
    fields['NVIDIA Relevancy'] ?? '',
  ].join(' ');

  const found = [];
  for (const sig of BIGTECH_SIGNALS) {
    if (sig.re.test(text)) found.push(sig.label);
  }
  if (SERIAL_SIGNALS.some(re => re.test(text))) found.push('Serial founder');
  return found;
}

function stripMarkdown(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [text](url) -> text
    .replace(/\*\*([^*]+)\*\*/g, '$1')         // **bold** -> bold
    .replace(/\*([^*]+)\*/g, '$1')             // *italic* -> italic
    .replace(/`([^`]+)`/g, '$1')              // `code` -> code
    .trim();
}

function parseMarkdownTable(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 3) return [];
  const parseRow = line => line.split('|').slice(1, -1).map(c => c.trim());
  const headers = parseRow(lines[0]);
  return lines.slice(2)
    .map(line => {
      const cells = parseRow(line);
      const obj = {};
      headers.forEach((h, i) => { obj[h] = cells[i] ?? ''; });
      return obj;
    })
    .filter(row => Object.values(row).some(v => v));
}

/** Parse one "### N. Company" block into a company record (rank is assigned by the caller). */
export function parseCompanySection(sectionText) {
  const lines = sectionText.trim().split('\n');

  // Company name: ### N. Name
  const nameMatch = lines[0]?.match(/^###\s+\d+\.\s+(.+)/);
  const name = nameMatch?.[1]?.trim() ?? '';
  if (!name) return null;

  // Metadata line: **Vertical:** X | **Total Raised to Date:** X | **Stage:** X | **NVIDIA Tech Alignment:** emoji label
  const metaLine = lines.find(l => l.includes('**Vertical:**'));
  let vertical = '', totalRaisedDisplay = '', stage = '';
  let alignmentLevel = 'maybe', alignmentLabel = 'Maybe';

  if (metaLine) {
    const segs = metaLine.split('|');
    for (const seg of segs) {
      const m = seg.match(/\*\*([^*]+):\*\*\s*(.*)/);
      if (!m) continue;
      const k = m[1].trim(), v = m[2].trim();
      if (k === 'Vertical') vertical = v;
      else if (k === 'Total Raised to Date') totalRaisedDisplay = v;
      else if (k === 'Stage') stage = v;
      else if (k === 'NVIDIA Tech Alignment') {
        alignmentLevel = v.includes('🟢') ? 'strong' : 'maybe';
        alignmentLabel = alignmentLevel === 'strong' ? 'Strong potential' : 'Maybe';
      }
    }
  }

  // Parse remaining fields via line-by-line state machine
  const metaLineIdx = lines.findIndex(l => l.includes('**Vertical:**'));
  const bodyLines = lines.slice(Math.max(1, metaLineIdx + 1));

  const fields = {};
  let curKey = null;
  let curLines = [];
  let articleUrl = null;

  const flush = () => {
    if (curKey != null) fields[curKey] = curLines.join('\n').trim();
  };

  for (const line of bodyLines) {
    const m = line.match(/^\*\*(.+?):\*\*(.*)$/);
    if (m) {
      flush();
      let key = m[1].trim();
      const rest = m[2].trim();

      // Today's interesting [article](URL): special case
      const artM = key.match(/Today's interesting \[article\]\(([^)]+)\)/);
      if (artM) {
        articleUrl = artM[1];
        key = "Today's interesting article";
      }

      curKey = key;
      curLines = rest ? [rest] : [];
    } else if (curKey !== null) {
      curLines.push(line);
    }
  }
  flush();

  // Website
  const wsRaw = fields['Website'] ?? '';
  const wsM = wsRaw.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
  const websiteUrl = wsM ? wsM[2] : null;
  const websiteDisplay = wsM ? wsM[1] : null;

  // Investors — split by comma, clean up
  const investorsRaw = (fields['Investors'] ?? '').replace(/\n/g, ' ');
  const investors = investorsRaw.split(',').map(s => stripMarkdown(s)).filter(Boolean);

  // Inception Status — take first part before | or * notes
  let inceptionStatus = fields['Inception Status'] ?? '';
  inceptionStatus = inceptionStatus.split('|')[0].replace(/\*[^*]*\*/g, '').trim();

  const description = stripMarkdown((fields['What we do'] ?? '').replace(/\n/g, ' ').trim());
  const articleBody = stripMarkdown((fields["Today's interesting article"] ?? '').replace(/\n+/g, ' ').trim());
  const nvidiaRelevancy = stripMarkdown((fields['NVIDIA Relevancy'] ?? '').replace(/\n/g, ' ').trim());
  // Keep raw markdown — the drawer renders the embedded [case study](url) links
  const caseStudy = (fields['NVIDIA Case Study'] ?? '').replace(/\n/g, ' ').trim() || null;
  const workloadResearch = parseMarkdownTable(fields['Account Workload Research'] ?? '');
  const founderBackground = extractFounderBackground(fields);
  const country = extractCountry(fields);

  return {
    name,
    vertical,
    totalRaised: { display: totalRaisedDisplay, valueM: parseCurrencyToM(totalRaisedDisplay) },
    stage,
    nvidiaAlignment: { level: alignmentLevel, label: alignmentLabel },
    description,
    articleUrl,
    articleBody,
    investors,
    nvidiaRelevancy,
    caseStudy,
    workloadResearch,
    inceptionStatus,
    founderBackground,
    country,
    companyKey: buildCompanyKey(name, websiteUrl),
    websiteUrl,
    websiteDisplay,
  };
}

/** Parse a whole briefing's markdown text. */
export function parseBriefingContent(rawContent) {
  const content = rawContent.replace(/\r\n/g, '\n');

  // Extract date from header line ## Weekday, Month DD, YYYY
  const dateLineM = content.match(/^## (.+) · NVIDIA Inception Edition/m);
  const label = dateLineM ? dateLineM[1] : '';

  const companies = [];
  for (const section of content.split(SECTION_SEPARATOR)) {
    const trimmed = section.trim();
    if (/^###\s+\d+\./.test(trimmed)) {
      const company = parseCompanySection(trimmed);
      if (company && company.name) {
        companies.push({ ...company, rank: companies.length + 1 });
      }
    }
  }

  const totalCapitalM = companies.reduce((sum, c) => sum + (c.totalRaised.valueM ?? 0), 0);

  return { label, totalCapitalM: Math.round(totalCapitalM), companies };
}

export function parseBriefingFile(filePath) {
  return parseBriefingContent(readFileSync(filePath, 'utf8'));
}
