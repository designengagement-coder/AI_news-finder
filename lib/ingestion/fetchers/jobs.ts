import { CONTENT_CATEGORIES, SOURCE_TYPES } from "@/lib/constants";
import { relevantJobTerms, type JobSourceConfig } from "@/lib/ingestion/sources";
import { extractStructuredSignals, summarize } from "@/lib/ingestion/normalize";
import { IngestionRecord } from "@/lib/types";

type GreenhouseBoardResponse = {
  jobs: Array<{
    absolute_url: string;
    location?: { name?: string };
    title: string;
    updated_at?: string;
    metadata?: Array<{ name: string; value: string }>;
    content?: string;
  }>;
};

function matchesRelevantRole(title: string, content: string) {
  const haystack = `${title} ${content}`.toLowerCase();
  return relevantJobTerms.some((term) => haystack.includes(term));
}

function parseWorkplaceType(text: string) {
  const normalized = text.toLowerCase();

  if (normalized.includes("remote")) {
    return "remote";
  }
  if (normalized.includes("hybrid")) {
    return "hybrid";
  }
  return "on-site";
}

export async function fetchGreenhouseBoard(config: JobSourceConfig): Promise<IngestionRecord[]> {
  const apiUrl = `${config.boardUrl.replace("https://boards.greenhouse.io/", "https://boards-api.greenhouse.io/v1/boards/")}/jobs?content=true`;
  const response = await fetch(apiUrl, {
    headers: {
      "User-Agent": "AI-Design-Intelligence/1.0"
    },
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error(`Greenhouse fetch failed for ${config.company}: ${response.status}`);
  }

  const payload = (await response.json()) as GreenhouseBoardResponse;

  return payload.jobs
    .filter((job) => matchesRelevantRole(job.title, job.content ?? ""))
    .slice(0, 20)
    .map((job) => {
      const text = summarize((job.content ?? "").replace(/<[^>]+>/g, " "));
      const structured = extractStructuredSignals(job.title, text);
      const metadataText = (job.metadata ?? []).map((entry) => `${entry.name}: ${entry.value}`).join(" | ");

      return {
        externalId: job.absolute_url,
        title: job.title,
        summary: text,
        fullUrl: job.absolute_url,
        sourceName: `${config.company} Careers`,
        sourceType: SOURCE_TYPES.JOB_BOARD,
        sourceBaseUrl: config.boardUrl,
        publishedAt: job.updated_at ? new Date(job.updated_at) : undefined,
        category: CONTENT_CATEGORIES.JOB,
        subcategory: "product-design-ai",
        tags: ["hiring", "product-design", "ai-talent-market", parseWorkplaceType(metadataText)],
        region: job.location?.name ?? config.locationHint,
        relevanceScore: 82,
        trendScore: 55,
        contentType: "job",
        extractedSkills: structured.skills,
        extractedTools: structured.tools,
        extractedCompanies: [config.company, ...structured.companies],
        metadata: {
          company: config.company,
          location: job.location?.name ?? null,
          workplaceType: parseWorkplaceType(metadataText),
          metadata: job.metadata ?? []
        }
      };
    });
}
