import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BRIEFINGS_DIR = join(__dirname, '../../briefings');
const OUTPUT_DIR = join(__dirname, '../src/data');
const OUTPUT_PATH = join(OUTPUT_DIR, 'briefings.json');

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

function stripMarkdown(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [text](url) -> text
    .replace(/\*\*([^*]+)\*\*/g, '$1')         // **bold** -> bold
    .replace(/\*([^*]+)\*/g, '$1')             // *italic* -> italic
    .replace(/`([^`]+)`/g, '$1')              // `code` -> code
    .trim();
}

function extractUrl(text) {
  const m = text.match(/\(https?:\/\/[^)]+\)/);
  return m ? m[0].slice(1, -1) : null;
}

function parseCompanySection(sectionText) {
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

  // Salesforce URL
  const sfRaw = fields['Salesforce'] ?? '';
  const sfM = sfRaw.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
  const salesforceUrl = sfM ? sfM[2] : null;

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
    inceptionStatus,
    salesforceUrl,
    websiteUrl,
    websiteDisplay,
  };
}

function parseBriefingFile(filePath) {
  const content = readFileSync(filePath, 'utf8');

  // Extract date from header line ## Weekday, Month DD, YYYY
  const dateLineM = content.match(/^## (.+) · NVIDIA Inception Edition/m);
  const label = dateLineM ? dateLineM[1] : '';

  // Split into sections on "---" lines
  const sections = content.split(/\n---\n/);

  const companies = [];
  for (const section of sections) {
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

// Main
const files = readdirSync(BRIEFINGS_DIR)
  .filter(f => /^\d{4}-\d{2}-\d{2}-briefing\.md$/.test(f))
  .sort()
  .reverse();

const briefings = files.map(filename => {
  const date = filename.replace('-briefing.md', '');
  const filePath = join(BRIEFINGS_DIR, filename);
  console.log(`Parsing ${filename}...`);
  const data = parseBriefingFile(filePath);
  return { date, ...data };
});

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_PATH, JSON.stringify({ briefings }, null, 2));
console.log(`\u2713 Wrote ${briefings.length} briefings (${briefings.reduce((s,b) => s + b.companies.length, 0)} companies) to ${OUTPUT_PATH}`);
