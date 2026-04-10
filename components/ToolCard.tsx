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
  const usableSummary =
    displaySummary.toLowerCase() === "discussion | link" || displaySummary.toLowerCase() === "discussion link"
      ? ""
      : displaySummary;

  return (
    <article className="flex min-w-[84vw] snap-start flex-col rounded-xl border border-black/70 bg-transparent p-5 transition duration-200 ease-out sm:min-w-[320px] lg:min-w-[340px]">
      <div className="flex items-start gap-3">
        {item.toolLogoUrl ? (
          <img
            src={item.toolLogoUrl}
            alt={item.title}
            className="mt-0.5 h-10 w-10 shrink-0 rounded-full bg-bg-alt object-cover"
            loading="lazy"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
            {item.subcategory ?? "tool"}
          </p>
          <h3
            className="mt-1.5 text-[1.25rem] font-semibold leading-snug text-ink"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden"
            }}
          >
            {item.title}
          </h3>
          <p className="mt-1.5 text-[13px] text-muted">{item.sourceName}</p>
        </div>
      </div>

      <div className="mt-3 min-h-[84px]">
        {usableSummary ? (
          <p
            className="text-[15px] leading-7 text-slate"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden"
            }}
          >
            {usableSummary}
          </p>
        ) : null}
      </div>

      <div className="mt-3 min-h-[132px] rounded-xl bg-accent-light/70 px-4 py-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-accent-dark">Design use case</p>
        <p
          className="mt-2 text-[14px] leading-7 text-ink"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden"
          }}
        >
          {displayUseCase}
        </p>
      </div>

      <a
        href={item.fullUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex h-10 w-fit items-center rounded-full border border-accent px-5 text-sm font-medium text-accent transition hover:border-accent-hover hover:text-accent-hover"
      >
        View tool
      </a>
    </article>
  );
}
