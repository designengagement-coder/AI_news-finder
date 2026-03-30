type EmptyStateCardProps = {
  title: string;
  description: string;
};

export function EmptyStateCard({ title, description }: EmptyStateCardProps) {
  return (
    <div className="min-w-[84vw] snap-start rounded-[28px] border border-dashed border-black/10 bg-white/70 p-6 text-center text-sm shadow-panel sm:min-w-[360px] lg:min-w-[410px]">
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-2 leading-6 text-slate">{description}</p>
    </div>
  );
}
