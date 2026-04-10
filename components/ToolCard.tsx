import { cleanDisplayText } from "@/lib/utils";

type ToolCardProps = {
  item: {
    title: string;
    summary: string;
    subcategory: string | null;
    sourceName: string;
    fullUrl: string;
    toolLogoUrl?: string;
    designerUseCase?: string;
  };
};

export function ToolCard({ item }: ToolCardProps) {
  const displaySummary = cleanDisplayText(item.summary);
  const displayUseCase = cleanDisplayText(
    item.designerUseCase ?? "Useful for faster ideation, iteration, and design workflow support."
  );

  return (
    <article className="min-w-[84vw] snap-start rounded-lg border border-border bg-white p-5 shadow-panel transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-hover sm:min-w-[360px] lg:min-w-[410px]">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-surface">
          {item.toolLogoUrl ? (
            <img src={item.toolLogoUrl} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <span className="text-lg font-semibold text-muted">{item.title.slice(0, 1)}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-muted">
            {item.subcategory ?? "tool"} · {item.sourceName}
          </p>
          <h3 className="mt-2 text-[1.25rem] font-semibold leading-snug text-ink">{item.title}</h3>
        </div>
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

      <div className="mt-4 rounded-md bg-surface p-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-muted">Designer use case</p>
        <p className="mt-2 text-[15px] leading-7 text-ink">{displayUseCase}</p>
      </div>

      <a
        href={item.fullUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex h-10 items-center rounded-md border border-accent px-5 text-sm font-medium text-accent transition hover:border-accent-hover hover:text-accent-hover"
      >
        View tool
      </a>
    </article>
  );
}
