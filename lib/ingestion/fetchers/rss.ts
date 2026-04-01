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
import {
  editorialReviewForDesign,
  isDirectDesignSignal,
  isGenericNoise,
  rewriteForDesignContext,
  shouldRewriteIndirectSignal
} from "@/lib/ingestion/rewrite";
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
  const items = (feed.items ?? []).slice(0, 25).filter((item) => item.link && item.title);

  const records: Array<IngestionRecord | null> = await Promise.all(
    items.map(async (item) => {
      const rawSummary = htmlToText(item.contentSnippet ?? item.content ?? item.summary ?? "");
      const title = item.title!.trim();
      let summary = summarize(rawSummary || title);
      const publishedAt = item.isoDate ? new Date(item.isoDate) : item.pubDate ? new Date(item.pubDate) : undefined;
      const category = deriveCategory(title, summary, config.category);
      let tags = inferTags(title, summary, config.tags);

      if (isGenericNoise(title, summary, tags)) {
        return null;
      }

      const editorialReview = await editorialReviewForDesign({
        title,
        summary,
        sourceName: config.name,
        category,
        tags
      });

      if (editorialReview) {
        if (!editorialReview.keep) {
          return null;
        }

        summary = summarize(editorialReview.rewrittenSummary);
        tags = inferTags(title, `${summary} ${editorialReview.rationale}`, [...config.tags, ...editorialReview.rewrittenTags]);
      }

      if (shouldRewriteIndirectSignal(title, summary, category, tags)) {
        const rewritten = await rewriteForDesignContext({
          title,
          summary,
          sourceName: config.name,
          category,
          tags
        });

        if (rewritten) {
          summary = summarize(rewritten.rewrittenSummary);
          tags = inferTags(title, `${summary} ${rewritten.rationale}`, [...config.tags, ...rewritten.rewrittenTags]);
        }
      }

      if (!isDirectDesignSignal(title, summary, category, tags) && !editorialReview?.isDirectDesignSignal) {
        return null;
      }

      const structured = extractStructuredSignals(title, summary);
      const scores = scoreRecord(category, title, publishedAt);
      const mediaCandidate =
        item.enclosure?.url ??
        (Array.isArray((item as { mediaContent?: Array<{ url?: string; $?: { url?: string } }> }).mediaContent)
          ? (item as { mediaContent?: Array<{ url?: string; $?: { url?: string } }> }).mediaContent?.[0]?.url ??
            (item as { mediaContent?: Array<{ url?: string; $?: { url?: string } }> }).mediaContent?.[0]?.$?.url
          : undefined);

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
        tags,
        region: config.region,
        contentType: "article",
        extractedSkills: structured.skills,
        extractedTools: structured.tools,
        extractedCompanies: structured.companies,
        relevanceScore: scores.relevanceScore,
        trendScore: scores.trendScore,
        metadata: {
          creator: item.creator ?? null,
          imageUrl: mediaCandidate ?? null
        }
      };
    })
  );

  return records.filter((record): record is IngestionRecord => record !== null);
}
