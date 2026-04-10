import { relativeDate } from "@/lib/utils";

type RefreshStatusBarProps = {
  lastUpdated: string | null;
  sourceCount: number;
  itemCount: number;
  lastSuccessfulRun: string | null;
  failedRunsLast24h: number;
  latestFailureMessage: string | null;
};

export function RefreshStatusBar({
  lastUpdated,
  sourceCount,
  itemCount,
  lastSuccessfulRun: _lastSuccessfulRun,
  failedRunsLast24h: _failedRunsLast24h,
  latestFailureMessage: _latestFailureMessage
}: RefreshStatusBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-1 py-2 text-sm text-ink">
      <span className="font-medium">Refresh status</span>
      <span className="text-muted">Last updated: {relativeDate(lastUpdated)}</span>
      <span className="text-muted">{sourceCount} active sources</span>
      <span className="text-muted">{itemCount} indexed items</span>
    </div>
  );
}
