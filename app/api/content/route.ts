import { NextRequest, NextResponse } from "next/server";
import { getDashboardData } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const payload = await getDashboardData({
    q: searchParams.get("q") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    timeframe: searchParams.get("timeframe") ?? undefined,
    sourceType: searchParams.get("sourceType") ?? undefined,
    sort: (searchParams.get("sort") as "latest" | "trending" | "relevance" | null) ?? undefined
  });

  return NextResponse.json(payload);
}
