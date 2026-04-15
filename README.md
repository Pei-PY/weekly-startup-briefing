# Daily Startup Briefing

Daily AI and tech startup news briefings for the NVIDIA Inception team. 

Each briefing surfaces the top 10 startup stories of the day — funding rounds, acquisitions, and product launches — filtered to pre-seed through Series D companies across AI/ML, SaaS, developer tools, deep tech, robotics, and consumer tech.

---

## Research Methodology

The briefing is generated via a structured five-phase research protocol executed against live web sources and Salesforce CRM. A strict 24-hour publication window is established at the start of each run.

A minimum of 45 web searches and direct URL fetches are executed across Tier-1 sources plus one targeted search per each of NVIDIA's 23 Inception verticals, casting a wide raw candidate pool. Each candidate article is deep-read to extract funding stage, total raised, investors, founding team signals, traction metrics, and market timing.

Three sequential Salesforce SOQL queries are run against the nvcrm-dev org for every surviving candidate — an Account lookup (checking `AccountTags__c`), an Inception Connect Profile lookup (checking `Membership_Status__c`), and an Opportunity count query — each capable of triggering immediate disqualification.

Surviving candidates are scored on a 13-point rubric across investor quality, founder signal, market timing, traction, and NVIDIA relevance. A vertical-diversity constraint (max 2 per vertical, target 7+ distinct verticals) is applied to ensure the final 10 represent broad coverage of NVIDIA's strategic focus areas.

Each entry includes a company description, the news hook, investor syndicate, NVIDIA technology relevance mapped to specific products (BioNeMo, NIM, Jetson Orin, Omniverse, etc.), and Inception membership status.

---

## Disqualification Criteria

A company is disqualified if any of the following are true:

| Criterion | Reason |
|-----------|--------|
| Total capital raised > $200M | Targets early-stage companies before they accumulate NVIDIA attention |
| Salesforce `AccountTags__c` = "Enterprise Customer" | Active NVIDIA enterprise sales relationship already exists |
| Inception `Membership_Status__c` = "Member - High Touch" or "Member - Nominated High Touch" | Already receiving dedicated Inception support |
| 2+ Opportunity records on the Salesforce Account | NVIDIA field team is already actively covering them |
| Publication timestamp older than 24 hours | Stale news |
| Announcing entity is a VC fund, not an operating startup | Not an Inception-eligible company |

---

## Sources

TechCrunch, VentureBeat, Hacker News, Product Hunt, The Information, Crunchbase News, Axios, a16z News, Y Combinator Companies, SiliconAngle, GeekWire, BioPharma Dive, Data Center Dynamics, Tech.eu, EU-Startups, TechStartups, TechFundingNews, Business Insider, Fortune, Reddit (r/startups, r/artificial), LinkedIn

---

## Web App

Browse all briefings at **[richling98.github.io/daily-startup-briefing](https://richling98.github.io/daily-startup-briefing/)** — a dark-themed React frontend with sortable columns, company detail drawers, and filters by vertical, stage, and NVIDIA fit.

Auto-deployed to GitHub Pages on every push to `main`. See [`briefing-app/README.md`](briefing-app/README.md) for local development instructions.

---

## Structure

```
briefings/          # Daily briefing files (YYYY-MM-DD-briefing.md)
briefing-app/       # Vite + React frontend (GitHub Pages)
docs/               # Reference docs (NVIDIA Inception, tech stack)
skills/             # Claude Code skill definition
CLAUDE.md           # Project instructions for Claude Code
```

## Usage

In Claude Code, run:

```
/startup-briefing
```

This researches the day's top startup news and saves a briefing to `briefings/`. The web app picks it up automatically on the next push to `main`.
