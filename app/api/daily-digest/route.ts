import { NextRequest, NextResponse } from "next/server";
import { getDailyDigest } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limitParam = Number(searchParams.get("limit") ?? "5");
  const limit = Number.isFinite(limitParam) ? limitParam : 5;

  const payload = await getDailyDigest(limit);

  return NextResponse.json(payload);
}
