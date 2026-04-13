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

export type DailyDigestItem = {
  id: string;
  title: string;
  summary: string;
  url: string;
  sourceName: string;
  publishedAt: string | null;
  tags: string[];
};

export type DailyDigestPayload = {
  generatedAt: string;
  date: string;
  lastUpdated: string | null;
  sections: {
    aiNews: DailyDigestItem[];
    aiTools: DailyDigestItem[];
    aiWorkflows: DailyDigestItem[];
    aiJobs: DailyDigestItem[];
  };
  slackText: string;
};

export type DashboardPayload = {
  priorityNews: unknown[];
  tools: unknown[];
  launchedTools: unknown[];
  jobs: unknown[];
  workflows: unknown[];
  designImpact: unknown[];
  marketSignals: unknown[];
  headlineTicker: string;
  refreshStatus: {
    lastUpdated: string | null;
    sourceCount: number;
    itemCount: number;
    lastSuccessfulRun: string | null;
    failedRunsLast24h: number;
    latestFailureMessage: string | null;
  };
};

export const EMPTY_DASHBOARD_PAYLOAD: DashboardPayload = {
  priorityNews: [],
  tools: [],
  launchedTools: [],
  jobs: [],
  workflows: [],
  designImpact: [],
  marketSignals: [],
  headlineTicker: "Feed is waiting for refresh",
  refreshStatus: {
    lastUpdated: null,
    sourceCount: 0,
    itemCount: 0,
    lastSuccessfulRun: null,
    failedRunsLast24h: 0,
    latestFailureMessage: null
  }
};
