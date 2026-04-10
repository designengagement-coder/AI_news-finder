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
    <form className="w-full md:w-auto">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
        <input
          name="q"
          defaultValue={defaultQuery}
          placeholder="Search product design AI signals"
          className="min-w-0 rounded-full border border-border bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-muted focus:border-border-strong md:w-[320px] md:flex-none md:py-2.5"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:flex md:w-auto">
          <select
            name="category"
            defaultValue={selectedCategory}
            className="rounded-full border border-border bg-white px-4 py-3 text-sm text-ink md:py-2.5"
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
            className="rounded-full border border-border bg-white px-4 py-3 text-sm text-ink md:py-2.5"
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
            className="col-span-2 rounded-full border border-border bg-white px-4 py-3 text-sm text-ink sm:col-span-1 md:py-2.5"
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
          className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:bg-accent-hover md:py-2.5"
        >
          Apply
        </button>
      </div>
    </form>
  );
}
