const categoryOptions = [
  { value: "", label: "All focus areas" },
  { value: "JOB", label: "Jobs" },
  { value: "TOOL", label: "Tools" },
  { value: "WORKFLOW", label: "Workflows" },
  { value: "DESIGN_IMPACT", label: "Design impact" }
];

const timeframeOptions = [
  { value: "", label: "Any time" },
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" }
];

const sortOptions = [
  { value: "latest", label: "Latest" },
  { value: "trending", label: "Trending" },
  { value: "relevance", label: "Relevance" }
];

type TopBarFiltersProps = {
  selectedCategory?: string;
  selectedTimeframe?: string;
  selectedSort?: string;
  defaultQuery?: string;
};

export function TopBarFilters({
  selectedCategory,
  selectedTimeframe,
  selectedSort,
  defaultQuery
}: TopBarFiltersProps) {
  return (
    <form className="rounded-[24px] border border-black/8 bg-white/92 p-3 shadow-panel">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <input
          name="q"
          defaultValue={defaultQuery}
          placeholder="Search product design AI signals"
          className="min-w-0 flex-1 rounded-2xl border border-black/8 bg-[#f7f8f4] px-4 py-3 text-sm text-ink outline-none placeholder:text-slate"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:w-auto">
          <select
            name="category"
            defaultValue={selectedCategory}
            className="rounded-2xl border border-black/8 bg-[#f7f8f4] px-4 py-3 text-sm text-ink"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            name="timeframe"
            defaultValue={selectedTimeframe}
            className="rounded-2xl border border-black/8 bg-[#f7f8f4] px-4 py-3 text-sm text-ink"
          >
            {timeframeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            name="sort"
            defaultValue={selectedSort ?? "latest"}
            className="rounded-2xl border border-black/8 bg-[#f7f8f4] px-4 py-3 text-sm text-ink sm:col-span-1 col-span-2"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink/90"
        >
          Apply
        </button>
      </div>
    </form>
  );
}
