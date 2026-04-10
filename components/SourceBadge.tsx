type SourceBadgeProps = {
  source: string;
  label?: string;
};

export function SourceBadge({ source, label }: SourceBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded bg-accent-light px-2.5 py-1 text-[12px] font-semibold uppercase tracking-[0.04em] text-accent-dark">
      <span className="h-2 w-2 rounded-full bg-accent" />
      {label ? `${label}: ` : ""}
      {source}
    </span>
  );
}
