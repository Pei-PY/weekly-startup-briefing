# Weekly Startup Briefing

Weekly AI and tech startup news briefings. 

Each briefing surfaces the top 10 startup stories of the day — funding rounds, acquisitions, and product launches — filtered to pre-seed through Series D companies across AI/ML, SaaS, developer tools, deep tech, robotics, and consumer tech.

v1.0: Focused on South East Asia countries - Singapore, VietNam, Malaysia, Indonesia, Thailand, Phillipines

Contributors: Richard Ling, Damon Asbis, Pei Yi Pang

---

## Research Methodology

The briefing is generated via a structured five-phase research protocol executed against live web sources, with a duplicate check against every earlier briefing. A strict 24-hour publication window is established at the start of each run.

A minimum of 61 web searches and direct URL fetches are executed across Tier-1 sources, LinkedIn indexed discovery queries, and one targeted search per each of the 23 tracked verticals, casting a wide raw candidate pool. Each candidate article or post is deep-read to extract funding stage, total raised, investors, founding team signals, traction metrics, and market timing.

Every surviving candidate is checked against all earlier briefings by normalized company name, parenthetical alias, and website domain. A company appears in the series once: its first appearance stays, and any later repeat is disqualified (or removed with `npm run dedupe:fix` in `briefing-app/`).

Surviving candidates are scored on a 13-point rubric across investor quality, founder signal, market timing, traction, and technology relevance. A vertical-diversity constraint (max 2 per vertical, target 7+ distinct verticals) is applied to ensure the final 10 represent broad coverage of the tracked verticals.

Each entry includes a company description, the news hook, investor syndicate, and technology relevance mapped to specific GPU products and SDKs.

---

## Disqualification Criteria

A company is disqualified if any of the following are true:

| Criterion | Reason |
|-----------|--------|
| Total capital raised > $200M | Targets early-stage companies before they attract broad attention |
| Already featured in an earlier briefing | Each company appears once across the series; follow-up news belongs in Interesting Trends |
| Publication timestamp older than 24 hours | Stale news |
| Announcing entity is a VC fund, not an operating startup | Not an operating company |

---

## Sources

TechCrunch, VentureBeat, Hacker News, Product Hunt, The Information, Crunchbase News, Axios, a16z News, Y Combinator Companies, SiliconAngle, GeekWire, BioPharma Dive, Data Center Dynamics, Tech.eu, EU-Startups, TechStartups, TechFundingNews, Business Insider, Fortune, Reddit (r/startups, r/artificial), LinkedIn indexed public posts, and optional authenticated LinkedIn connector/API enrichment when available.

---

## Web App

Browse all briefings at **[pei-py.github.io/weekly-startup-briefing](https://pei-py.github.io/weekly-startup-briefing/)** — a dark-themed React frontend with sortable columns, company detail drawers, and filters by vertical, stage, and fit.

Auto-deployed to GitHub Pages on every push to `main`. See [`briefing-app/README.md`](briefing-app/README.md) for local development instructions.

---

## Structure

```
briefings/          # Weekly briefing files (YYYY-MM-DD-briefing.md)
briefing-app/       # Vite + React frontend (GitHub Pages)
docs/               # Reference docs (program background, tech stack)
skills/             # Claude Code skill definition
CLAUDE.md           # Project instructions for Claude Code
```

## Usage

In Claude Code, run:

```
/startup-briefing
```

This researches the day's top startup news and saves a briefing to `briefings/`. The web app picks it up automatically on the next push to `main`.

## Duplicate check

Each company may appear in the series only once; the earliest briefing keeps it. From `briefing-app/`:

```
npm run dedupe:check   # list companies repeated in a later briefing (also the first step of `npm run build`)
npm run dedupe:fix     # remove the later repeats and renumber the affected briefings
node scripts/dedupe-briefings.js --lookup "Company name" company.com   # has this company been covered before?
```
