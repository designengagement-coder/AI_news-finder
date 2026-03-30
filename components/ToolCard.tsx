import { UnifiedCard } from "@/components/UnifiedCard";

type ToolCardProps = {
  item: {
    title: string;
    summary: string;
    subcategory: string | null;
    sourceName: string;
    fullUrl: string;
  };
};

export function ToolCard({ item }: ToolCardProps) {
  return (
    <UnifiedCard
      title={item.title}
      summary={item.summary}
      sourceName={item.sourceName}
      fullUrl={item.fullUrl}
      categoryLabel={item.subcategory ?? "tool"}
      accent="tool"
    />
  );
}
