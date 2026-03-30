import type { ReactNode } from "react";
import { DismissibleToolBanner } from "@/components/DismissibleToolBanner";
import { EmptyStateCard } from "@/components/EmptyStateCard";
import { getDashboardData, getInsights } from "@/lib/analytics";
import { HighlightTicker } from "@/components/HighlightTicker";
import { JobInsightCard } from "@/components/JobInsightCard";
import { MarketSignalPanel } from "@/components/MarketSignalPanel";
import { NewsCard } from "@/components/NewsCard";
import { RefreshStatusBar } from "@/components/RefreshStatusBar";
import { SectionCarousel } from "@/components/SectionCarousel";
import { ToolCard } from "@/components/ToolCard";
import { TopBarFilters } from "@/components/TopBarFilters";
import { UpskillingPanel } from "@/components/UpskillingPanel";
import { WorkflowCard } from "@/components/WorkflowCard";

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
  const params = await searchParams;
  const filters = {
    q: single(params.q),
    category: single(params.category),
    timeframe: single(params.timeframe),
    sourceType: single(params.sourceType),
    sort: (single(params.sort) as "latest" | "trending" | "relevance" | undefined) ?? "latest"
  };

  const [dashboard, insights] = await Promise.all([getDashboardData(filters), getInsights()]);

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

        <div className="mt-6">
          <DismissibleToolBanner item={dashboard.heroTool as any} />
        </div>

        <SectionCarousel
          eyebrow="Priority News"
          title="AI product design and job signals first"
          description="This section is now weighted toward design-role change, hiring demand, and practical product-team impact before broader AI updates."
          viewMoreHref="/?category=JOB"
        >
          {renderCollection(
            dashboard.priorityNews as any[],
            (item: any) =>
              item.category === "JOB" ? <JobInsightCard key={item.id} item={item} /> : <NewsCard key={item.id} item={item} />,
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
          eyebrow="Market Demand"
          title="Cross-signal patterns worth watching"
          description="A narrower view across jobs, workflows, and design commentary that points to where expectations are consolidating."
          viewMoreHref="/?sort=relevance"
        >
          {renderCollection(
            dashboard.marketSignals as any[],
            (item: any) => <NewsCard key={item.id} item={item} />,
            "No market signals yet",
            "Signals will appear once more design-oriented sources have been refreshed."
          )}
        </SectionCarousel>

        <div className="mt-10">
          <MarketSignalPanel items={dashboard.marketSignals as any} />
        </div>

        <div className="mt-10">
          <UpskillingPanel {...insights} />
        </div>
      </div>
    </main>
  );
}
