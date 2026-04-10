import { ExternalLink } from "lucide-react";
import { cleanDisplayText, relativeDate } from "@/lib/utils";

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
  default: "border border-black/70",
  job: "border border-black/70",
  tool: "border border-black/70",
  workflow: "border border-black/70"
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
  const displaySummary = cleanDisplayText(summary);
  const visibleTags = tags.slice(0, 4);
  const visibleMeta = meta.slice(0, 2);

  return (
    <article className={`flex min-w-[84vw] snap-start flex-col overflow-hidden rounded-xl bg-transparent p-6 transition duration-200 ease-out sm:min-w-[360px] lg:min-w-[410px] ${accentStyles[accent]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3
            className="text-[1.25rem] font-semibold leading-snug text-ink"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden"
            }}
          >
            {title}
          </h3>
        </div>
        <a
          href={fullUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-full bg-transparent p-2 text-muted"
          aria-label={`Open ${title}`}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      <div className="mt-3 min-h-[132px]">
        <p
          className="text-[15px] leading-7 text-slate"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 4,
            overflow: "hidden"
          }}
        >
          {displaySummary}
        </p>
      </div>
      {visibleMeta.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-3">
          {visibleMeta.map((item) => (
            <span key={item} className="rounded-full bg-bg-alt px-3 py-1.5 text-[13px] text-muted">
              {item}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-auto flex min-h-[72px] items-end justify-between gap-x-3 gap-y-3 pt-3">
        <div className="flex max-w-[72%] flex-wrap gap-2">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="whitespace-nowrap rounded-full bg-accent-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-accent-dark"
            >
              {tag}
            </span>
          ))}
        </div>
        {publishedAt ? (
          <span className="text-[13px] uppercase tracking-[0.08em] text-slate">{relativeDate(publishedAt)}</span>
        ) : null}
      </div>
    </article>
  );
}
