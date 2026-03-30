import { Flame } from "lucide-react";
import { SourceBadge } from "@/components/SourceBadge";

type TrendCardProps = {
  item: {
    title: string;
    summary: string;
    sourceName: string;
    trendScore: number;
    fullUrl: string;
  };
};

export function TrendCard({ item }: TrendCardProps) {
  return (
    <article className="rounded-[28px] bg-ink p-5 text-white shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <SourceBadge source={item.sourceName} label="hot" />
        <div className="inline-flex items-center gap-1 rounded-full bg-coral/20 px-3 py-1 text-xs font-semibold text-coral">
          <Flame className="h-3.5 w-3.5" />
          {item.trendScore.toFixed(0)}
        </div>
      </div>
      <h3 className="mt-4 text-lg font-semibold leading-tight">{item.title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/72">{item.summary}</p>
      <a href={item.fullUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-medium">
        Open source
      </a>
    </article>
  );
}
