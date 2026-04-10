import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [sourceCount, itemCount, lastSuccessfulRun, failedRunsLast24h, latestFailure] = await Promise.all([
    prisma.source.count(),
    prisma.contentItem.count(),
    prisma.ingestionRun.findFirst({
      where: { status: "success", finishedAt: { not: null } },
      orderBy: { finishedAt: "desc" }
    }),
    prisma.ingestionRun.count({
      where: {
        status: "failed",
        startedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    }),
    prisma.ingestionRun.findFirst({
      where: { status: "failed" },
      orderBy: { finishedAt: "desc" }
    })
  ]);

  return NextResponse.json({
    ok: true,
    sourceCount,
    itemCount,
    lastSuccessfulRun: lastSuccessfulRun?.finishedAt?.toISOString() ?? null,
    failedRunsLast24h,
    latestFailureMessage: latestFailure?.message ?? null,
    checkedAt: new Date().toISOString()
  });
}
