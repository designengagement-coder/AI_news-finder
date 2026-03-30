type MarketSignalPanelProps = {
  items: Array<{
    title: string;
    sourceName: string;
    extractedSkills: string[];
    extractedTools: string[];
  }>;
};

export function MarketSignalPanel({ items }: MarketSignalPanelProps) {
  return (
    <section className="rounded-[32px] border border-black/8 bg-white/90 p-6 shadow-panel">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate">Market Demand</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Signals shaping product design roles</h2>
        </div>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <article key={item.title} className="rounded-3xl border border-black/8 bg-[#f5f7f3] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate">{item.sourceName}</p>
            <h3 className="mt-2 text-base font-semibold text-ink">{item.title}</h3>
            <p className="mt-3 text-sm text-slate">
              Skills: {item.extractedSkills.slice(0, 3).join(", ") || "signal emerging"}
            </p>
            <p className="mt-1 text-sm text-slate">
              Tools: {item.extractedTools.slice(0, 3).join(", ") || "mixed stack"}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
