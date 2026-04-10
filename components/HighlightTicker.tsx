type HighlightTickerProps = {
  text: string;
};

export function HighlightTicker({ text }: HighlightTickerProps) {
  return (
    <div className="flex min-h-10 items-center rounded-md bg-breaking px-4 py-2 text-sm text-white">
      <span className="mr-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-white/90">
        Day signal
      </span>
      <span className="font-medium">{text}</span>
    </div>
  );
}
