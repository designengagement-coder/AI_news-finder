import type { ReactNode } from "react";
import { EmptyStateCard } from "@/components/EmptyStateCard";
import { getDashboardData } from "@/lib/analytics";
import { JobInsightCard } from "@/components/JobInsightCard";
import { NewsCard } from "@/components/NewsCard";
import { RefreshStatusBar } from "@/components/RefreshStatusBar";
import { SectionCarousel } from "@/components/SectionCarousel";
import { ToolCard } from "@/components/ToolCard";
import { WorkflowCard } from "@/components/WorkflowCard";
import { maybeAutoRefresh } from "@/lib/ingestion/auto-refresh";
import { EMPTY_DASHBOARD_PAYLOAD } from "@/lib/types";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const revalidate = 300;

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
  await searchParams;
  const dashboard = await getDashboardData({ sort: "latest" }).catch(() => EMPTY_DASHBOARD_PAYLOAD);

  return (
    <main className="min-h-screen px-5 pb-6 pt-6 md:px-10 lg:px-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <section className="pb-3">
          <div className="mx-auto flex min-h-16 w-full max-w-[1440px] flex-col gap-3 rounded-xl bg-surface px-4 py-3 md:flex-row md:items-center md:justify-between md:gap-4 md:px-5 md:py-0">
            <div className="shrink-0">
              <h1 className="font-serif text-[1.45rem] leading-none tracking-[-0.03em] text-ink md:text-[1.6rem]">
                Signal Desk
              </h1>
            </div>
            <RefreshStatusBar {...dashboard.refreshStatus} compact />
          </div>
        </section>

        <SectionCarousel
          eyebrow="Priority News"
          title="AI product and design signals first"
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
