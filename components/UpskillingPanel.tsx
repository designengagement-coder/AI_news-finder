type UpskillingPanelProps = {
  topSkills: Array<{ label: string; count: number }>;
  topTools: Array<{ label: string; count: number }>;
  recurringThemes: string[];
  recommendedLearning: string[];
};

export function UpskillingPanel({
  topSkills,
  topTools,
  recurringThemes,
  recommendedLearning
}: UpskillingPanelProps) {
  return (
    <section className="rounded-[32px] border border-black/8 bg-white/90 p-6 shadow-panel">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate">Upskilling Insights</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">What the team should learn next</h2>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-black/8 bg-[#f5f7f3] p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">Top skills</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {topSkills.map((skill) => (
              <span key={skill.label} className="rounded-full bg-white px-3 py-1.5 text-sm text-ink">
                {skill.label} ({skill.count})
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-black/8 bg-[#f5f7f3] p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">Top tools</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {topTools.map((tool) => (
              <span key={tool.label} className="rounded-full bg-white px-3 py-1.5 text-sm text-ink">
                {tool.label} ({tool.count})
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">Recurring themes</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate">
            {recurringThemes.map((theme) => (
              <li key={theme}>{theme}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">Recommended next moves</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate">
            {recommendedLearning.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
