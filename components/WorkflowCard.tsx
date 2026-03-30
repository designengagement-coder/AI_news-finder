import { UnifiedCard } from "@/components/UnifiedCard";

type WorkflowCardProps = {
  item: {
    title: string;
    summary: string;
    tags: string[];
    sourceName: string;
    fullUrl: string;
  };
};

export function WorkflowCard({ item }: WorkflowCardProps) {
  return (
    <UnifiedCard
      title={item.title}
      summary={item.summary}
      sourceName={item.sourceName}
      fullUrl={item.fullUrl}
      categoryLabel="workflow"
      tags={item.tags}
      accent="workflow"
    />
  );
}
