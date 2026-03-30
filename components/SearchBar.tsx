type SearchBarProps = {
  defaultValue?: string;
};

export function SearchBar({ defaultValue }: SearchBarProps) {
  return (
    <div className="rounded-2xl bg-white/85 p-3 shadow-panel ring-1 ring-black/5 backdrop-blur">
      <input
        name="q"
        defaultValue={defaultValue}
        placeholder="Search AI trends, jobs, tools, workflows, designers..."
        className="w-full border-none bg-transparent px-2 py-2 text-sm text-ink outline-none placeholder:text-slate"
      />
    </div>
  );
}
