import { CONTENT_CATEGORIES, SOURCE_TYPES, type ContentCategory, type SourceType } from "@/lib/constants";

export type RssSourceConfig = {
  name: string;
  type: SourceType;
  baseUrl: string;
  feedUrl: string;
  category: ContentCategory;
  subcategory?: string;
  tags: string[];
};

export type JobSourceConfig = {
  company: string;
  boardUrl: string;
  type: "greenhouse";
  locationHint?: string;
};

export const rssSources: RssSourceConfig[] = [
  {
    name: "OpenAI News",
    type: SOURCE_TYPES.BLOG,
    baseUrl: "https://openai.com",
    feedUrl: "https://openai.com/news/rss.xml",
    category: CONTENT_CATEGORIES.NEWS,
    tags: ["foundation-models", "product-launches"]
  },
  {
    name: "Anthropic News",
    type: SOURCE_TYPES.BLOG,
    baseUrl: "https://www.anthropic.com",
    feedUrl: "https://www.anthropic.com/news/rss.xml",
    category: CONTENT_CATEGORIES.NEWS,
    tags: ["labs", "product-updates"]
  },
  {
    name: "Hugging Face Blog",
    type: SOURCE_TYPES.BLOG,
    baseUrl: "https://huggingface.co",
    feedUrl: "https://huggingface.co/blog/feed.xml",
    category: CONTENT_CATEGORIES.NEWS,
    tags: ["open-source", "models"]
  },
  {
    name: "Product Hunt AI",
    type: SOURCE_TYPES.COMMUNITY,
    baseUrl: "https://www.producthunt.com",
    feedUrl: "https://www.producthunt.com/feed?category=artificial-intelligence",
    category: CONTENT_CATEGORIES.TOOL,
    tags: ["tool-discovery", "launches"]
  },
  {
    name: "Figma Blog",
    type: SOURCE_TYPES.BLOG,
    baseUrl: "https://www.figma.com",
    feedUrl: "https://www.figma.com/blog/rss.xml",
    category: CONTENT_CATEGORIES.DESIGN_IMPACT,
    tags: ["product-design", "design-systems"]
  },
  {
    name: "Nielsen Norman Group",
    type: SOURCE_TYPES.BLOG,
    baseUrl: "https://www.nngroup.com",
    feedUrl: "https://www.nngroup.com/feed/rss/",
    category: CONTENT_CATEGORIES.DESIGN_IMPACT,
    tags: ["ux", "research"]
  },
  {
    name: "Lenny's Newsletter",
    type: SOURCE_TYPES.BLOG,
    baseUrl: "https://www.lennysnewsletter.com",
    feedUrl: "https://www.lennysnewsletter.com/feed",
    category: CONTENT_CATEGORIES.WORKFLOW,
    tags: ["product-teams", "adoption"]
  }
];

export const jobSources: JobSourceConfig[] = [
  { company: "OpenAI", boardUrl: "https://boards.greenhouse.io/openai", type: "greenhouse" },
  { company: "Anthropic", boardUrl: "https://boards.greenhouse.io/anthropic", type: "greenhouse" },
  { company: "Figma", boardUrl: "https://boards.greenhouse.io/figma", type: "greenhouse" },
  { company: "Miro", boardUrl: "https://boards.greenhouse.io/miro", type: "greenhouse" },
  { company: "Notion", boardUrl: "https://boards.greenhouse.io/notion", type: "greenhouse" }
];

export const relevantJobTerms = [
  "product designer",
  "ux designer",
  "design systems",
  "research",
  "prototype",
  "ai",
  "machine learning",
  "conversation design",
  "service design",
  "design operations"
];
