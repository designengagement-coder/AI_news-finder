import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [sourceCount, itemCount] = await Promise.all([prisma.source.count(), prisma.contentItem.count()]);

  return NextResponse.json({
    ok: true,
    sourceCount,
    itemCount,
    checkedAt: new Date().toISOString()
  });
}
