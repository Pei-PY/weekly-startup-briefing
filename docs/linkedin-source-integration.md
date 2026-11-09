# LinkedIn Source Integration

## Current State

The daily startup briefing repo lists LinkedIn as a source in high-level docs and
UI copy, but the active research protocol historically did not include
LinkedIn-specific search instructions. LinkedIn coverage is now explicit in
`skills/startup-briefing/SKILL.md`.

## Recommended Access Model

Use three layers:

1. Public indexed search against LinkedIn URLs.
2. Optional authenticated MCP/custom connector search when available.
3. Official LinkedIn APIs for known author/company-page retrieval when the authenticated user has approved permissions and page access.

Do not add browser scraping, credential collection, cookie reuse, unofficial
LinkedIn endpoints, or proxy crawling.

## Public Search Queries

Use these in every daily run:

- `site:linkedin.com/posts ("we raised" OR "raised" OR "funding") ("seed" OR "pre-seed" OR "Series A" OR "Series B" OR "Series C" OR "Series D") startup [TODAY] OR [YESTERDAY]`
- `site:linkedin.com/posts ("proud to announce" OR "excited to announce" OR "thrilled to announce") ("funding" OR "round" OR "launch") startup [TODAY] OR [YESTERDAY]`
- `site:linkedin.com/posts ("emerged from stealth" OR "launching today" OR "launched today" OR "now live") ("AI" OR "startup") [TODAY] OR [YESTERDAY]`
- `site:linkedin.com/posts ("led by" OR "co-led by") ("seed" OR "Series A" OR "Series B") ("AI startup" OR "deep tech startup") [TODAY] OR [YESTERDAY]`
- `site:linkedin.com/posts ("a16z" OR "Sequoia" OR "Benchmark" OR "Lightspeed" OR "General Catalyst" OR "Founders Fund") ("raised" OR "led" OR "launch") [TODAY] OR [YESTERDAY]`
- `site:linkedin.com/posts ("GPU" OR "CUDA" OR "Jetson" OR "Omniverse" OR "Isaac" OR "BioNeMo") ("startup" OR "launch" OR "funding") [TODAY] OR [YESTERDAY]`
- `site:linkedin.com/posts ("hiring founding" OR "founding engineer" OR "stealth") ("AI" OR "robotics" OR "defense" OR "healthcare") startup [TODAY] OR [YESTERDAY]`
- `site:linkedin.com/posts ("customer" OR "ARR" OR "pilots" OR "deployed") ("raised" OR "launch") ("AI startup" OR "robotics startup") [TODAY] OR [YESTERDAY]`

## Authenticated Connector Guidance

If a connector such as Verona MCP is available in the active client session, use it
only if it exposes a LinkedIn search or company/person discovery tool that returns
source URLs. The connector must be optional. If OAuth fails, disconnect/remove the
connector and reconnect it rather than pasting tokens or credentials into chat.

Verona MCP should not be the only LinkedIn source path for this repo because its
OAuth flow may be unavailable, may require per-user LinkedIn authorization, and may
not be enabled in every client or team workspace.

## Official LinkedIn API Guidance

Official LinkedIn APIs are not a broad keyword search feed for all LinkedIn posts.
The Posts API retrieves posts by known author URNs. Organization post retrieval
requires approved Community Management access, `r_organization_social`, and
appropriate company page roles. Member post retrieval requires restricted
`r_member_social`.

Use official APIs only for a watchlist of known pages or authors where access is
approved.

## Evidence Standard

LinkedIn can originate a candidate, but every candidate must still pass the normal
briefing checks:

- exact timestamp inside the research window
- company/stage/amount/total raised verification
- prior-coverage check against every earlier briefing (name, alias, website domain)
- Technology relevance scoring
- vertical diversity selection

Prefer durable primary links in final briefing entries. Use LinkedIn permalinks as
final links only when no better primary source exists.

## References

- LinkedIn API overview: https://learn.microsoft.com/en-us/linkedin/
- LinkedIn Marketing API Program: https://learn.microsoft.com/en-us/linkedin/marketing/?view=li-lms-2026-06
- LinkedIn OAuth overview: https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication
- LinkedIn Posts API: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2026-06
- LinkedIn Organization Lookup API: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/organization-lookup-api?view=li-lms-2026-06
- LinkedIn access tiers: https://learn.microsoft.com/en-us/linkedin/marketing/increasing-access?view=li-lms-2026-06
- LinkedIn API Terms of Use: https://www.linkedin.com/legal/l/api-terms-of-use
