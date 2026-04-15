# Briefing App

A Vite + React + Tailwind frontend for browsing NVIDIA Inception daily startup briefings. Live at **[richling98.github.io/daily-startup-briefing](https://richling98.github.io/daily-startup-briefing/)**.

---

## What it does

Displays every daily briefing as a sortable, filterable table. Click any row to open a full company detail drawer (Notion-style). A sidebar lists all briefing dates; a methodology panel explains the research protocol and scoring rubric.

**Columns:** Rank · Company · Vertical · Total Raised · Stage · NVIDIA Fit · Inception Status

**Filters:** Vertical · Stage · NVIDIA Fit

---

## Stack

- **Vite 8** + **React 19**
- **Tailwind CSS v4** (dark theme, NVIDIA green `#76B900` accent)
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

Run `npm run build` to parse + build in one step (used by CI).

---

## Deployment

Deployed to **GitHub Pages** via GitHub Actions on every push to `main`.

Workflow: `.github/workflows/deploy.yml`
- Installs deps (`npm ci`)
- Runs `npm run build` (parse → Vite build → `dist/`)
- Uploads `dist/` as a Pages artifact and deploys

`vite.config.js` sets `base: '/daily-startup-briefing/'` for the subdirectory path.

---

## Project structure

```
briefing-app/
├── scripts/
│   └── parse-briefings.js   # Markdown → JSON parser
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
