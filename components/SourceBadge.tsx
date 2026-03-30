type SourceBadgeProps = {
  source: string;
  label?: string;
};

export function SourceBadge({ source, label }: SourceBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1 text-xs font-medium text-slate shadow-sm ring-1 ring-black/5">
      <span className="h-2 w-2 rounded-full bg-saffron" />
      {label ? `${label}: ` : ""}
      {source}
    </span>
  );
}
