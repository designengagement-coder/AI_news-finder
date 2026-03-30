import { UnifiedCard } from "@/components/UnifiedCard";

type ContentCardProps = {
  item: {
    title: string;
    summary: string;
    fullUrl: string;
    sourceName: string;
    publishedAt: string | Date | null;
    tags: string[];
    category: string;
  };
};

export function NewsCard({ item }: ContentCardProps) {
  return (
    <UnifiedCard
      title={item.title}
      summary={item.summary}
      sourceName={item.sourceName}
      fullUrl={item.fullUrl}
      publishedAt={item.publishedAt}
      categoryLabel={item.category.toLowerCase().replace("_", " ")}
      tags={item.tags}
      accent="default"
    />
  );
}
