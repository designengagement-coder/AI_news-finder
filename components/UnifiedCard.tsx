import { ExternalLink } from "lucide-react";
import { SourceBadge } from "@/components/SourceBadge";
import { relativeDate } from "@/lib/utils";

type UnifiedCardProps = {
  title: string;
  summary: string;
  sourceName: string;
  fullUrl: string;
  publishedAt?: string | Date | null;
  categoryLabel: string;
  meta?: string[];
  tags?: string[];
  accent?: "default" | "job" | "tool" | "workflow";
};

const accentStyles = {
  default: "border-[#dde3d9]",
  job: "border-[#cad8d0]",
  tool: "border-[#dddccf]",
  workflow: "border-[#d7dfd5]"
} as const;

export function UnifiedCard({
  title,
  summary,
  sourceName,
  fullUrl,
  publishedAt,
  categoryLabel,
  meta = [],
  tags = [],
  accent = "default"
}: UnifiedCardProps) {
  return (
    <article className={`min-w-[84vw] snap-start rounded-[26px] border bg-white p-5 shadow-panel sm:min-w-[360px] lg:min-w-[410px] ${accentStyles[accent]}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <SourceBadge source={sourceName} label={categoryLabel} />
          <h3 className="text-lg font-semibold leading-tight text-ink">{title}</h3>
        </div>
        <a
          href={fullUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-black/8 bg-[#f6f7f3] p-2 text-slate"
          aria-label={`Open ${title}`}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate">{summary}</p>
      {meta.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {meta.slice(0, 3).map((item) => (
            <span key={item} className="rounded-full bg-[#f4f6f1] px-3 py-1 text-xs font-medium text-slate">
              {item}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-[#eef2eb] px-2.5 py-1 text-xs font-medium text-ink">
            {tag}
          </span>
        ))}
        {publishedAt ? (
          <span className="ml-auto text-[11px] font-semibold uppercase tracking-[0.18em] text-slate">
            {relativeDate(publishedAt)}
          </span>
        ) : null}
      </div>
    </article>
  );
}
