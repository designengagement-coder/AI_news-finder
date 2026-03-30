import Parser from "rss-parser";
import { CONTENT_CATEGORIES, type ContentCategory } from "@/lib/constants";
import { RssSourceConfig } from "@/lib/ingestion/sources";
import {
  deriveCategory,
  extractStructuredSignals,
  htmlToText,
  inferTags,
  summarize
} from "@/lib/ingestion/normalize";
import { IngestionRecord } from "@/lib/types";

const parser = new Parser({
  timeout: 15000,
  customFields: {
    item: [["media:content", "mediaContent", { keepArray: true }]]
  }
});

function scoreRecord(category: ContentCategory, title: string, publishedAt?: Date) {
  const hoursAgo = publishedAt ? Math.max(1, (Date.now() - publishedAt.getTime()) / 3_600_000) : 48;
  const recencyBoost = Math.max(5, 100 / hoursAgo);
  const keywordBoost = /ai|agent|design|workflow|launch|model/i.test(title) ? 18 : 8;
  const categoryBoost =
    category === CONTENT_CATEGORIES.DESIGN_IMPACT || category === CONTENT_CATEGORIES.JOB ? 18 : 12;

  return {
    relevanceScore: Number((keywordBoost + categoryBoost).toFixed(2)),
    trendScore: Number((recencyBoost + keywordBoost).toFixed(2))
  };
}

export async function fetchRssSource(config: RssSourceConfig): Promise<IngestionRecord[]> {
  const feed = await parser.parseURL(config.feedUrl);

  return (feed.items ?? [])
    .slice(0, 25)
    .filter((item) => item.link && item.title)
    .map((item) => {
      const rawSummary = htmlToText(item.contentSnippet ?? item.content ?? item.summary ?? "");
      const title = item.title!.trim();
      const summary = summarize(rawSummary || title);
      const publishedAt = item.isoDate ? new Date(item.isoDate) : item.pubDate ? new Date(item.pubDate) : undefined;
      const category = deriveCategory(title, summary, config.category);
      const structured = extractStructuredSignals(title, summary);
      const scores = scoreRecord(category, title, publishedAt);

      return {
        externalId: item.guid ?? item.link!,
        title,
        summary,
        fullUrl: item.link!,
        sourceName: config.name,
        sourceType: config.type,
        sourceBaseUrl: config.baseUrl,
        sourceFeedUrl: config.feedUrl,
        publishedAt,
        category,
        subcategory: config.subcategory,
        tags: inferTags(title, summary, config.tags),
        contentType: "article",
        extractedSkills: structured.skills,
        extractedTools: structured.tools,
        extractedCompanies: structured.companies,
        relevanceScore: scores.relevanceScore,
        trendScore: scores.trendScore,
        metadata: {
          creator: item.creator ?? null
        }
      };
    });
}
