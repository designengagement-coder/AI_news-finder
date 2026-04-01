import { SearchX } from "lucide-react";

type EmptyStateCardProps = {
  title: string;
  description: string;
};

export function EmptyStateCard({ title, description }: EmptyStateCardProps) {
  return (
    <div className="min-w-[84vw] snap-start rounded-[28px] border border-dashed border-black/10 bg-white/70 p-6 text-center text-sm shadow-panel sm:min-w-[360px] lg:min-w-[410px]">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-black/8 bg-[#f5f7f3] text-slate">
        <SearchX className="h-5 w-5" />
      </div>
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-2 leading-6 text-slate">{description}</p>
    </div>
  );
}
