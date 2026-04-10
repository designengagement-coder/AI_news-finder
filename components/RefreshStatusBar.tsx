import { relativeDate } from "@/lib/utils";

type RefreshStatusBarProps = {
  lastUpdated: string | null;
  sourceCount: number;
  itemCount: number;
};

export function RefreshStatusBar({ lastUpdated, sourceCount, itemCount }: RefreshStatusBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl bg-surface px-4 py-3 text-sm text-ink shadow-panel">
      <span className="font-medium">Refresh status</span>
      <span className="rounded-full bg-white/70 px-3 py-1 text-muted">Last update: {relativeDate(lastUpdated)}</span>
      <span className="rounded-full bg-white/70 px-3 py-1 text-muted">{sourceCount} active sources</span>
      <span className="rounded-full bg-white/70 px-3 py-1 text-muted">{itemCount} indexed items</span>
    </div>
  );
}
