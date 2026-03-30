type HighlightTickerProps = {
  text: string;
};

export function HighlightTicker({ text }: HighlightTickerProps) {
  return (
    <div className="rounded-2xl border border-[#d6ddd3] bg-[#f1f4ee] px-4 py-3 text-sm text-ink shadow-sm">
      <span className="mr-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate">
        Day signal
      </span>
      <span className="font-medium">{text}</span>
    </div>
  );
}
