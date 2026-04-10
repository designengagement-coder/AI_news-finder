import { ExternalLink } from "lucide-react";
import { SourceBadge } from "@/components/SourceBadge";
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
  default: "border-border",
  job: "border-border",
  tool: "border-border",
  workflow: "border-border"
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

  return (
    <article className={`min-w-[84vw] snap-start overflow-hidden rounded-lg border bg-white p-5 shadow-panel transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-hover sm:min-w-[360px] lg:min-w-[410px] ${accentStyles[accent]}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <SourceBadge source={sourceName} label={categoryLabel} />
          <h3 className="text-[1.25rem] font-semibold leading-snug text-ink">{title}</h3>
        </div>
        <a
          href={fullUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-border bg-surface p-2 text-muted"
          aria-label={`Open ${title}`}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      <div className="mt-4 min-h-[168px]">
        <p
          className="text-[15px] leading-7 text-slate"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 6,
            overflow: "hidden"
          }}
        >
          {displaySummary}
        </p>
      </div>
      {meta.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {meta.slice(0, 3).map((item) => (
            <span key={item} className="rounded bg-bg-alt px-2.5 py-1 text-[13px] text-muted">
              {item}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded bg-accent-light px-2.5 py-1 text-[12px] font-semibold uppercase tracking-[0.04em] text-accent-dark">
            {tag}
          </span>
        ))}
        {publishedAt ? (
          <span className="ml-auto text-[13px] text-muted">
            {relativeDate(publishedAt)}
          </span>
        ) : null}
      </div>
    </article>
  );
}
