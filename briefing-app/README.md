# Briefing App

A Vite + React + Tailwind frontend for browsing the weekly startup briefings. Live at **[pei-py.github.io/weekly-startup-briefing](https://pei-py.github.io/weekly-startup-briefing/)**.

---

## What it does

Displays every weekly briefing as a sortable, filterable table. Click any row to open a full company detail drawer (Notion-style). A sidebar lists all briefing dates; a methodology panel explains the research protocol and scoring rubric.

**Columns:** Rank · Company · Country · Vertical · Total Raised · Stage · Founder BG · Fit · Description · Today's News · Investors · Relevancy · Website

**Filters:** Vertical · Stage · Fit

---

## Stack

- **Vite 8** + **React 19**
- **Tailwind CSS v4** (dark theme, green `#76B900` accent)
- **lucide-react** icons
- Static JSON data (`src/data/briefings.json`) generated from markdown briefing files

---

## Local development

```bash
cd briefing-app

# Parse markdown briefings → JSON (run whenever briefings/ changes)
npm run parse

# Dev server with HMR
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Data pipeline

```
briefings/YYYY-MM-DD-briefing.md  →  scripts/parse-briefings.js  →  src/data/briefings.json
```

`parse-briefings.js` reads every `YYYY-MM-DD-briefing.md` from `../briefings/`, parses the structured markdown into typed JSON objects, and writes `src/data/briefings.json`. The Vite build inlines this file as a static asset.

Run `npm run build` to run the duplicate check, parse, and build in one step (used by CI).

---

## Duplicate check

A company may appear in the briefing series once; its earliest appearance is kept.

```bash
npm run dedupe:check      # report repeats (exit 1 if any) — also the first step of `npm run build`
npm run dedupe:fix        # remove the later repeats, renumber headings, fix the Summary / Vertical Coverage tables
node scripts/dedupe-briefings.js --lookup "Company name" company.com   # prior coverage for one company
```

Matching is by normalized company name or parenthetical alias (`SoBanHang (Finan)`). Names that differ only by generic words (`Pints` / `Pints AI`), or entries that merely share a website domain (portfolio companies listed under an investor's site), are reported for manual review and never removed automatically. `dedupe:fix` also appends a dated note to the briefing header naming the removed companies and where they were first covered. Afterwards re-run `npm run parse` and read the printed warnings — intro notes or trend paragraphs that mention a removed company are not edited.

---

## Deployment

Deployed to **GitHub Pages** via GitHub Actions on every push to `main`.

Workflow: `.github/workflows/deploy.yml`
- Installs deps (`npm ci`)
- Runs `npm run build` (duplicate check → parse → Vite build → `dist/`)
- Uploads `dist/` as a Pages artifact and deploys

`vite.config.js` sets `base: '/weekly-startup-briefing/'` for the subdirectory path.

---

## Project structure

```
briefing-app/
├── scripts/
│   ├── briefing-parser.js   # Markdown → company records (shared)
│   ├── company-key.js       # Company name / domain normalization (shared)
│   ├── dedupe-briefings.js  # Cross-briefing duplicate check / fix / lookup
│   └── parse-briefings.js   # Writes src/data/briefings.json
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx       # Date list + methodology panel
│   │   ├── BriefingView.jsx  # Header, filter bar, table wrapper
│   │   ├── CompanyTable.jsx  # Sortable table
│   │   └── CompanyDrawer.jsx # Full company detail drawer
│   ├── data/
│   │   └── briefings.json   # Generated — do not edit manually
│   ├── lib/
│   │   └── utils.js          # Badge colors, date formatters
│   ├── App.jsx
│   └── index.css
├── package.json
└── vite.config.js
```
