import { NextResponse } from "next/server";
import { getInsights } from "@/lib/analytics";

export async function GET() {
  return NextResponse.json(await getInsights());
}
