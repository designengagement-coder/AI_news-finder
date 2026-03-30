import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { CONTENT_CATEGORIES, type ContentCategory } from "@/lib/constants";
import { fetchGreenhouseBoard } from "@/lib/ingestion/fetchers/jobs";
import { fetchRssSource } from "@/lib/ingestion/fetchers/rss";
import { jobSources, rssSources } from "@/lib/ingestion/sources";
import { IngestionRecord } from "@/lib/types";
import { unique } from "@/lib/utils";

async function ensureSource(record: IngestionRecord) {
  return prisma.source.upsert({
    where: {
      name_baseUrl: {
        name: record.sourceName,
        baseUrl: record.sourceBaseUrl
      }
    },
    update: {
      type: record.sourceType,
      feedUrl: record.sourceFeedUrl,
      active: true
    },
    create: {
      name: record.sourceName,
      type: record.sourceType,
      baseUrl: record.sourceBaseUrl,
      feedUrl: record.sourceFeedUrl
    }
  });
}

function computeTrendLift(category: ContentCategory, tags: string[], skills: string[]) {
  let lift = 0;
  if (category === CONTENT_CATEGORIES.JOB || category === CONTENT_CATEGORIES.DESIGN_IMPACT) {
    lift += 10;
  }
  if (tags.includes("product-design")) {
    lift += 8;
  }
  if (skills.length >= 2) {
    lift += 6;
  }
  return lift;
}

async function upsertRecord(record: IngestionRecord) {
  const source = await ensureSource(record);
  const trendScore = (record.trendScore ?? 40) + computeTrendLift(record.category, record.tags, record.extractedSkills);

  return prisma.contentItem.upsert({
    where: { fullUrl: record.fullUrl },
    update: {
      externalId: record.externalId,
      title: record.title,
      summary: record.summary,
      sourceName: record.sourceName,
      sourceId: source.id,
      publishedAt: record.publishedAt,
      category: record.category,
      subcategory: record.subcategory,
      tags: unique(record.tags),
      region: record.region,
      relevanceScore: record.relevanceScore ?? 50,
      trendScore,
      contentType: record.contentType,
      extractedSkills: unique(record.extractedSkills),
      extractedTools: unique(record.extractedTools),
      extractedCompanies: unique(record.extractedCompanies),
      metadata: record.metadata as Prisma.InputJsonValue | undefined,
      fetchedAt: new Date()
    },
    create: {
      externalId: record.externalId,
      title: record.title,
      summary: record.summary,
      fullUrl: record.fullUrl,
      sourceName: record.sourceName,
      sourceId: source.id,
      publishedAt: record.publishedAt,
      category: record.category,
      subcategory: record.subcategory,
      tags: unique(record.tags),
      region: record.region,
      relevanceScore: record.relevanceScore ?? 50,
      trendScore,
      contentType: record.contentType,
      extractedSkills: unique(record.extractedSkills),
      extractedTools: unique(record.extractedTools),
      extractedCompanies: unique(record.extractedCompanies),
      metadata: record.metadata as Prisma.InputJsonValue | undefined
    }
  });
}

async function runSourceIngestion(sourceName: string, runner: () => Promise<IngestionRecord[]>) {
  const run = await prisma.ingestionRun.create({
    data: {
      status: "running",
      message: `Fetching ${sourceName}`
    }
  });

  try {
    const records = await runner();
    let itemsCreated = 0;
    let itemsUpdated = 0;

    for (const record of records) {
      const existing = await prisma.contentItem.findUnique({ where: { fullUrl: record.fullUrl } });
      await upsertRecord(record);
      if (existing) {
        itemsUpdated += 1;
      } else {
        itemsCreated += 1;
      }
    }

    await prisma.ingestionRun.update({
      where: { id: run.id },
      data: {
        status: "success",
        message: `Fetched ${records.length} records from ${sourceName}`,
        itemsCreated,
        itemsUpdated,
        finishedAt: new Date()
      }
    });

    return { itemsCreated, itemsUpdated, total: records.length };
  } catch (error) {
    await prisma.ingestionRun.update({
      where: { id: run.id },
      data: {
        status: "failed",
        message: error instanceof Error ? error.message : "Unknown ingestion error",
        finishedAt: new Date()
      }
    });
    throw error;
  }
}

export async function ingestAllSources() {
  const results: Array<{
    source: string;
    ok: boolean;
    itemsCreated?: number;
    itemsUpdated?: number;
    total?: number;
    error?: string;
  }> = [];

  for (const source of rssSources) {
    try {
      const result = await runSourceIngestion(source.name, () => fetchRssSource(source));
      results.push({ source: source.name, ok: true, ...result });
    } catch (error) {
      results.push({
        source: source.name,
        ok: false,
        error: error instanceof Error ? error.message : "Unknown ingestion error"
      });
    }
  }

  for (const source of jobSources) {
    try {
      const result = await runSourceIngestion(`${source.company} Careers`, () => fetchGreenhouseBoard(source));
      results.push({ source: `${source.company} Careers`, ok: true, ...result });
    } catch (error) {
      results.push({
        source: `${source.company} Careers`,
        ok: false,
        error: error instanceof Error ? error.message : "Unknown ingestion error"
      });
    }
  }

  return results;
}
