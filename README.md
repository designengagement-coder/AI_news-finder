# AI Trends, Jobs, and Design Intelligence

Production-oriented intelligence platform for design teams that need current AI signals, job-market shifts, workflow adoption patterns, and practical upskilling guidance.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Prisma + SQLite for zero-setup local development
- Real-source ingestion from RSS feeds and Greenhouse job boards
- Scheduled refresh entrypoint via protected API route or CLI script

## What it does

- Aggregates AI news, tool launches, workflow articles, and design-impact content from real feeds
- Pulls relevant AI/product-design job signals from public Greenhouse boards
- Normalizes items into a shared schema with source attribution, timestamps, tags, skills, tools, and companies
- Deduplicates by canonical URL
- Computes lightweight trend and relevance scores
- Surfaces market-demand and upskilling insights on the dashboard

## Project structure

```text
app/
  api/
    content/route.ts
    health/route.ts
    insights/route.ts
    refresh/route.ts
  globals.css
  layout.tsx
  page.tsx
components/
  FilterSidebar.tsx
  JobInsightCard.tsx
  MarketSignalPanel.tsx
  NewsCard.tsx
  RefreshStatusBar.tsx
  SearchBar.tsx
  SourceBadge.tsx
  ToolCard.tsx
  TrendCard.tsx
  UpskillingPanel.tsx
  WorkflowCard.tsx
lib/
  analytics.ts
  db.ts
  types.ts
  utils.ts
  ingestion/
    normalize.ts
    pipeline.ts
    sources.ts
    fetchers/
      jobs.ts
      rss.ts
prisma/
  schema.prisma
  seed.ts
scripts/
  refresh.ts
```

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy env config:

```bash
cp .env.example .env
```

3. Generate Prisma client and create schema:

```bash
npx prisma generate
npx prisma db push
```

4. Optional bootstrap seed:

```bash
npm run db:seed
```

5. Run the ingestion job once to fetch real data:

```bash
npm run refresh
```

6. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scheduled refresh

Two supported patterns:

- Protected endpoint:

```bash
curl -X POST http://localhost:3000/api/refresh \
  -H "Authorization: Bearer $INGESTION_API_KEY"
```

- Cron or scheduler:

```bash
*/30 * * * * cd /Users/ankushpanda/Documents/New\ project && npm run refresh >> /tmp/ai-intelligence-refresh.log 2>&1
```

Recommended cadence: every 30 to 60 minutes.

If `ENABLE_AUTO_REFRESH="true"`, the dashboard will also trigger a refresh on page load when the last successful ingestion is older than 30 minutes. This helps returning users see newer content without manually running the script, but scheduled refresh remains the more reliable production path.

## Search and filters

- Keyword search on title and summary
- Category filter
- Timeframe filter
- Latest / trending / relevance sorting

## Notes

- The ingestion layer is wired to real internet sources, but depends on network availability at runtime.
- Local development uses SQLite, so you do not need PostgreSQL installed to run the first version.
- If `OPENAI_API_KEY` is set, indirectly relevant AI news can be rewritten into product-design context during ingestion. Generic AI news without design relevance is filtered out.
- Product Hunt and some blogs may change feed formats; add or swap sources in [`/Users/ankushpanda/.codex/worktrees/6c26/New project/lib/ingestion/sources.ts`](/Users/ankushpanda/.codex/worktrees/6c26/New project/lib/ingestion/sources.ts) as needed.
- The seed is only for first-run usability; real ingestion is the intended source of truth.
