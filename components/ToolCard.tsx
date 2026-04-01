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
  return (
    <article className="min-w-[84vw] snap-start rounded-[26px] border border-[#dddccf] bg-white p-5 shadow-panel sm:min-w-[360px] lg:min-w-[410px]">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-black/8 bg-[#f5f7f3]">
          {item.toolLogoUrl ? (
            <img src={item.toolLogoUrl} alt={item.title} className="h-full w-full object-cover" />
          ) : (
            <span className="text-lg font-semibold text-slate">{item.title.slice(0, 1)}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">
            {item.subcategory ?? "tool"} · {item.sourceName}
          </p>
          <h3 className="mt-2 text-lg font-semibold leading-tight text-ink">{item.title}</h3>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate">{item.summary}</p>

      <div className="mt-4 rounded-2xl bg-[#f5f7f3] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">Designer use case</p>
        <p className="mt-2 text-sm leading-6 text-ink">
          {item.designerUseCase ?? "Useful for faster ideation, iteration, and design workflow support."}
        </p>
      </div>

      <a
        href={item.fullUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-ink"
      >
        View tool
      </a>
    </article>
  );
}
