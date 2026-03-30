const categories = ["ALL", "NEWS", "TOOL", "JOB", "WORKFLOW", "DESIGN_IMPACT"];
const timeframes = [
  { value: "", label: "Any time" },
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" }
];
const sourceTypes = [
  { value: "", label: "Any source" },
  { value: "BLOG", label: "Blogs" },
  { value: "RSS", label: "RSS feeds" },
  { value: "JOB_BOARD", label: "Job boards" },
  { value: "COMMUNITY", label: "Communities" }
];
const sorts = [
  { value: "latest", label: "Latest" },
  { value: "trending", label: "Trending" },
  { value: "relevance", label: "Relevance" }
];

type FilterSidebarProps = {
  selectedCategory?: string;
  selectedTimeframe?: string;
  selectedSourceType?: string;
  selectedSort?: string;
};

export function FilterSidebar({
  selectedCategory,
  selectedTimeframe,
  selectedSourceType,
  selectedSort
}: FilterSidebarProps) {
  return (
    <aside className="space-y-5 rounded-[28px] bg-white/80 p-5 shadow-panel ring-1 ring-black/5 backdrop-blur">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate">Category</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="submit"
              name="category"
              value={category === "ALL" ? "" : category}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                (selectedCategory || "") === (category === "ALL" ? "" : category)
                  ? "bg-spruce text-white"
                  : "bg-mist text-ink"
              }`}
            >
              {category.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate">Timeframe</label>
        <select
          name="timeframe"
          defaultValue={selectedTimeframe}
          className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
        >
          {timeframes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate">Source type</label>
        <select
          name="sourceType"
          defaultValue={selectedSourceType}
          className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
        >
          {sourceTypes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate">Sort</label>
        <select
          name="sort"
          defaultValue={selectedSort ?? "latest"}
          className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
        >
          {sorts.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-coral px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-coral/90"
      >
        Apply filters
      </button>
    </aside>
  );
}
