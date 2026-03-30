import { relativeDate } from "@/lib/utils";

type RefreshStatusBarProps = {
  lastUpdated: string | null;
  sourceCount: number;
  itemCount: number;
};

export function RefreshStatusBar({ lastUpdated, sourceCount, itemCount }: RefreshStatusBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-black/8 bg-white/88 px-4 py-3 text-sm text-ink shadow-sm">
      <span className="font-semibold">Refresh status</span>
      <span className="rounded-full bg-[#f4f6f1] px-3 py-1">Last update: {relativeDate(lastUpdated)}</span>
      <span className="rounded-full bg-[#f4f6f1] px-3 py-1">{sourceCount} active sources</span>
      <span className="rounded-full bg-[#f4f6f1] px-3 py-1">{itemCount} indexed items</span>
    </div>
  );
}
