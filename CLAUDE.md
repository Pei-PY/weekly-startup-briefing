# Weekly Startup Briefing — Project

This folder stores weekly AI and tech startup news briefings.

## Purpose

Each briefing summarizes the top 10 startup news stories for the current day, focusing on:
- **Stage**: Pre-seed through Series D only (no public companies)
- **Sectors**: AI/ML, SaaS, developer tools, deep tech, robotics, consumer tech
- **Topics**: Funding rounds, acquisitions, new product launches, major pivots
- **Sources**: TechCrunch, Y Combinator/HN, Product Hunt, Business Insider, Fortune, VentureBeat, Reddit, LinkedIn indexed public posts, and optional authenticated LinkedIn connector/API enrichment when available

## File naming

Briefing files are named: `YYYY-MM-DD-briefing.md`

## How to run

Type `/startup-briefing` to generate today's briefing.

## Duplicate rule

A company may appear in the briefing series once; the earliest briefing keeps it. Before adding a company, check prior coverage from the project root:

```
node briefing-app/scripts/dedupe-briefings.js --lookup "Company name" company.com
```

`cd briefing-app && npm run dedupe:check` lists repeats across all briefings and gates `npm run build`; `npm run dedupe:fix` removes the later repeats and renumbers the affected files.

## Output location

All briefings are saved to: `~/Documents/Claude/weekly-startup-briefing/briefings/`

## Skills

Local skill definitions live in `skills/`. These are the source of truth for editing.
When a skill is updated here, copy it to `~/.claude/skills/<name>/SKILL.md` for it to take effect.

| Skill | Invoke | Description |
|-------|--------|-------------|
| [startup-briefing](skills/startup-briefing/SKILL.md) | `/startup-briefing` | Weekly AI/tech startup news briefing |

## Docs

Reference documents live in `docs/`.

| Document | Description |
|----------|-------------|
| [NVIDIA Inception program and Startup Origination role](docs/NVIDIA%20Inception%20program%20and%20Startup%20Origination%20role.md) | Comprehensive reference on the Inception program, NVentures, sourcing signals, and origination strategy |
| [NVIDIA tech deep dive](docs/NVIDIA%20tech%20deep%20dive.md) | Full NVIDIA hardware and software stack — GPU hardware, edge AI, networking, CUDA-X, NIM, Omniverse, Isaac, Clara, BioNeMo, DRIVE, developer SDKs |
