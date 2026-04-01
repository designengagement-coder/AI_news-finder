import type { ReactNode } from "react";
import { EmptyStateCard } from "@/components/EmptyStateCard";
import { getDashboardData } from "@/lib/analytics";
import { HighlightTicker } from "@/components/HighlightTicker";
import { JobInsightCard } from "@/components/JobInsightCard";
import { NewsCard } from "@/components/NewsCard";
import { RefreshStatusBar } from "@/components/RefreshStatusBar";
import { SectionCarousel } from "@/components/SectionCarousel";
import { ToolCard } from "@/components/ToolCard";
import { TopBarFilters } from "@/components/TopBarFilters";
import { WorkflowCard } from "@/components/WorkflowCard";
import { maybeAutoRefresh } from "@/lib/ingestion/auto-refresh";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const revalidate = 300;

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function renderCollection<T>(
  items: T[],
  render: (item: T) => ReactNode,
  emptyTitle: string,
  emptyDescription: string
) {
  if (items.length === 0) {
    return <EmptyStateCard title={emptyTitle} description={emptyDescription} />;
  }

  return items.map(render);
}

export default async function Home({ searchParams }: PageProps) {
  await maybeAutoRefresh();

  const params = await searchParams;
  const filters = {
    q: single(params.q),
    category: single(params.category),
    timeframe: single(params.timeframe),
    sourceType: single(params.sourceType),
    sort: (single(params.sort) as "latest" | "trending" | "relevance" | undefined) ?? "latest"
  };

  const dashboard = await getDashboardData(filters);

  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[30px] border border-black/8 bg-white/78 px-5 py-5 shadow-panel md:px-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate">
                  AI trends, jobs, and design intelligence
                </p>
                <h1 className="mt-2 max-w-4xl text-3xl font-semibold leading-tight text-ink md:text-5xl">
                  Product-design AI signals, without the generic market noise
                </h1>
              </div>
            </div>
            <TopBarFilters
              defaultQuery={filters.q}
              selectedCategory={filters.category}
              selectedTimeframe={filters.timeframe}
              selectedSort={filters.sort}
            />
          </div>
        </section>

        <div className="mt-4">
          <HighlightTicker text={dashboard.headlineTicker} />
        </div>

        <div className="mt-4">
          <RefreshStatusBar {...dashboard.refreshStatus} />
        </div>

        <SectionCarousel
          eyebrow="Priority News"
          title="AI product and design signals first"
          description="The top of the feed stays focused on high-value design impact and workflow implications before broader categories."
          viewMoreHref="/?category=DESIGN_IMPACT"
        >
          {renderCollection(
            dashboard.priorityNews as any[],
            (item: any) => <NewsCard key={item.id} item={item} />,
            "No priority design signals yet",
            "Run the refresh job to pull in product-design focused AI updates."
          )}
        </SectionCarousel>

        <SectionCarousel
          eyebrow="AI Tools"
          title="Tools that matter to product teams"
          description="New launches and tool signals with clear design and workflow relevance."
          viewMoreHref="/?category=TOOL"
        >
          {renderCollection(
            dashboard.tools as any[],
            (item: any) => <ToolCard key={item.id} item={item} />,
            "No tool discoveries yet",
            "Enable a refresh run to populate product launch and tool activity."
          )}
        </SectionCarousel>

        <SectionCarousel
          eyebrow="AI Workflows"
          title="Adoption patterns teams can practice"
          description="Workflow examples focused on research, prototyping, synthesis, operations, and delivery."
          viewMoreHref="/?category=WORKFLOW"
        >
          {renderCollection(
            dashboard.workflows as any[],
            (item: any) => <WorkflowCard key={item.id} item={item} />,
            "No workflow examples yet",
            "Workflow insights will appear after the content pipeline captures adoption articles."
          )}
        </SectionCarousel>

        <SectionCarousel
          eyebrow="Design Impact"
          title="How AI is changing product design roles"
          description="Signals around expectations, responsibilities, and the emerging AI-native design toolkit."
          viewMoreHref="/?category=DESIGN_IMPACT"
        >
          {renderCollection(
            dashboard.designImpact as any[],
            (item: any) => <WorkflowCard key={item.id} item={item} />,
            "No design-impact items yet",
            "Design-specific AI signals will appear as those sources are ingested."
          )}
        </SectionCarousel>

        <SectionCarousel
          eyebrow="Signals to Watch"
          title="Cross-signal patterns worth watching"
          description="A narrower view across design commentary and workflow shifts that points to where expectations are consolidating."
          viewMoreHref="/?sort=relevance"
        >
          {renderCollection(
            dashboard.marketSignals as any[],
            (item: any) => <NewsCard key={item.id} item={item} />,
            "No market signals yet",
            "Signals will appear once more design-oriented sources have been refreshed."
          )}
        </SectionCarousel>

        <SectionCarousel
          eyebrow="New AI Tools"
          title="Recently launched tools to evaluate"
          description="A dedicated stream of newly launched or newly surfaced AI tools that may be worth testing in product design workflows."
          viewMoreHref="/?category=TOOL&sort=latest"
        >
          {renderCollection(
            ((dashboard.launchedTools as any[])?.length ? dashboard.launchedTools : dashboard.tools) as any[],
            (item: any) => <ToolCard key={item.id} item={item} />,
            "No newly launched tools yet",
            "Newly launched AI tools will appear here after the next successful refresh."
          )}
        </SectionCarousel>

        <SectionCarousel
          eyebrow="AI Jobs"
          title="Design roles in the AI market"
          description="This section is kept lower for now while the job pipeline is still being tightened toward more relevant product and design roles."
          viewMoreHref="/?category=JOB"
        >
          {renderCollection(
            dashboard.jobs as any[],
            (item: any) => <JobInsightCard key={item.id} item={item} />,
            "No design-focused AI jobs yet",
            "Relevant product and design roles will appear here as the job source parsers improve."
          )}
        </SectionCarousel>
      </div>
    </main>
  );
}
