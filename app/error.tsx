"use client";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-lg rounded-[32px] bg-white/85 p-8 text-center shadow-panel ring-1 ring-black/5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate">Application error</p>
        <h1 className="mt-3 text-2xl font-semibold text-ink">The intelligence feed could not load.</h1>
        <p className="mt-3 text-sm leading-6 text-slate">
          {error.message || "Check the database connection and whether ingestion has populated the store."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 rounded-xl bg-spruce px-4 py-2.5 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
