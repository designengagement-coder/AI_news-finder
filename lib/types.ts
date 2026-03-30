import type { ContentCategory, SourceType } from "@/lib/constants";

export type IngestionRecord = {
  externalId?: string;
  title: string;
  summary: string;
  fullUrl: string;
  sourceName: string;
  sourceType: SourceType;
  sourceBaseUrl: string;
  sourceFeedUrl?: string;
  publishedAt?: Date;
  category: ContentCategory;
  subcategory?: string;
  tags: string[];
  region?: string;
  relevanceScore?: number;
  trendScore?: number;
  contentType: string;
  extractedSkills: string[];
  extractedTools: string[];
  extractedCompanies: string[];
  metadata?: Record<string, unknown>;
};

export type FilterState = {
  q?: string;
  category?: string;
  timeframe?: string;
  sourceType?: string;
  sort?: "latest" | "trending" | "relevance";
};

export type DashboardPayload = {
  priorityNews: unknown[];
  tools: unknown[];
  workflows: unknown[];
  designImpact: unknown[];
  marketSignals: unknown[];
  heroTool: unknown | null;
  headlineTicker: string;
  refreshStatus: {
    lastUpdated: string | null;
    sourceCount: number;
    itemCount: number;
  };
};
