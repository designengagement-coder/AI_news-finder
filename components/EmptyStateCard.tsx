import { SearchX } from "lucide-react";

type EmptyStateCardProps = {
  title: string;
  description: string;
};

export function EmptyStateCard({ title, description }: EmptyStateCardProps) {
  return (
    <div className="min-w-[84vw] snap-start rounded-lg border border-dashed border-border bg-white p-6 text-center shadow-panel sm:min-w-[360px] lg:min-w-[410px]">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-muted">
        <SearchX className="h-5 w-5" />
      </div>
      <p className="mt-4 text-lg font-semibold text-ink">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}
