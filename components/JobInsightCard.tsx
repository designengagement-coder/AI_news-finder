import { UnifiedCard } from "@/components/UnifiedCard";

type JobInsightCardProps = {
  item: {
    title: string;
    summary: string;
    region: string | null;
    extractedSkills: string[];
    extractedCompanies: string[];
    metadata: { workplaceType?: string } | null;
    fullUrl: string;
  };
};

export function JobInsightCard({ item }: JobInsightCardProps) {
  return (
    <UnifiedCard
      title={item.title}
      summary={item.summary}
      sourceName={item.extractedCompanies[0] ?? "Hiring team"}
      fullUrl={item.fullUrl}
      categoryLabel="job signal"
      meta={[item.region ?? "Location flexible", item.metadata?.workplaceType ?? "Workplace mode pending"]}
      tags={item.extractedSkills}
      accent="job"
    />
  );
}
