export default function Loading() {
  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-56 rounded-[36px] bg-white/60 shadow-panel" />
        <div className="h-14 rounded-2xl bg-white/60 shadow-panel" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-52 rounded-[28px] bg-white/60 shadow-panel" />
          <div className="h-52 rounded-[28px] bg-white/60 shadow-panel" />
        </div>
      </div>
    </main>
  );
}
