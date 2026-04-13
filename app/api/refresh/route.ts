import { NextRequest, NextResponse } from "next/server";
import { ingestAllSources } from "@/lib/ingestion/pipeline";

function isAuthorized(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const allowedSecrets = [process.env.INGESTION_API_KEY, process.env.CRON_SECRET].filter(Boolean);

  if (allowedSecrets.length === 0) {
    return true;
  }

  return allowedSecrets.some((secret) => authHeader === `Bearer ${secret}`);
}

async function runRefresh(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await ingestAllSources();
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Refresh failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return runRefresh(request);
}

export async function POST(request: NextRequest) {
  return runRefresh(request);
}
