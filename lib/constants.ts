export const CONTENT_CATEGORIES = {
  NEWS: "NEWS",
  TOOL: "TOOL",
  JOB: "JOB",
  WORKFLOW: "WORKFLOW",
  DESIGN_IMPACT: "DESIGN_IMPACT",
  MARKET_SIGNAL: "MARKET_SIGNAL"
} as const;

export const SOURCE_TYPES = {
  RSS: "RSS",
  BLOG: "BLOG",
  JOB_BOARD: "JOB_BOARD",
  REPORT: "REPORT",
  COMMUNITY: "COMMUNITY",
  API: "API"
} as const;

export type ContentCategory = (typeof CONTENT_CATEGORIES)[keyof typeof CONTENT_CATEGORIES];
export type SourceType = (typeof SOURCE_TYPES)[keyof typeof SOURCE_TYPES];
