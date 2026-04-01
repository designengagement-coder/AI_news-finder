import { subMinutes } from "date-fns";
import { prisma } from "@/lib/db";
import { ingestAllSources } from "@/lib/ingestion/pipeline";

let refreshPromise: Promise<void> | null = null;

export async function maybeAutoRefresh() {
  if (process.env.ENABLE_AUTO_REFRESH !== "true") {
    return;
  }

  const cutoff = subMinutes(new Date(), 30);
  const [runningRun, lastFinishedRun] = await Promise.all([
    prisma.ingestionRun.findFirst({
      where: { status: "running" },
      orderBy: { startedAt: "desc" }
    }),
    prisma.ingestionRun.findFirst({
      where: { status: "success", finishedAt: { not: null } },
      orderBy: { finishedAt: "desc" }
    })
  ]);

  if (runningRun) {
    return;
  }

  const lastFinishedAt = lastFinishedRun?.finishedAt ?? null;
  const isStale = !lastFinishedAt || lastFinishedAt < cutoff;

  if (!isStale) {
    return;
  }

  if (!refreshPromise) {
    refreshPromise = ingestAllSources()
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }

  await refreshPromise;
}
