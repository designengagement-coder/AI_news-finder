import { CONTENT_CATEGORIES, SOURCE_TYPES, type ContentCategory, type SourceType } from "@/lib/constants";

export type RssSourceConfig = {
  name: string;
  type: SourceType;
  baseUrl: string;
  feedUrl: string;
  enabled?: boolean;
  category: ContentCategory;
  subcategory?: string;
  tags: string[];
  region?: string;
};

export type JobSourceConfig = {
  company: string;
  boardUrl: string;
  type: "greenhouse" | "career-portal";
  enabled?: boolean;
  locationHint?: string;
  searchUrl?: string;
};

export const rssSources: RssSourceConfig[] = [
  {
    name: "OpenAI News",
    type: SOURCE_TYPES.BLOG,
    baseUrl: "https://openai.com",
    feedUrl: "https://openai.com/news/rss.xml",
    category: CONTENT_CATEGORIES.NEWS,
    tags: ["foundation-models", "product-launches"],
    region: "USA"
  },
  {
    name: "Anthropic News",
    type: SOURCE_TYPES.BLOG,
    baseUrl: "https://www.anthropic.com",
    feedUrl: "https://www.anthropic.com/news/rss.xml",
    enabled: false,
    category: CONTENT_CATEGORIES.NEWS,
    tags: ["labs", "product-updates"],
    region: "USA"
  },
  {
    name: "Hugging Face Blog",
    type: SOURCE_TYPES.BLOG,
    baseUrl: "https://huggingface.co",
    feedUrl: "https://huggingface.co/blog/feed.xml",
    category: CONTENT_CATEGORIES.NEWS,
    tags: ["open-source", "models"],
    region: "USA"
  },
  {
    name: "Analytics India Magazine",
    type: SOURCE_TYPES.BLOG,
    baseUrl: "https://analyticsindiamag.com",
    feedUrl: "https://analyticsindiamag.com/feed/",
    category: CONTENT_CATEGORIES.NEWS,
    tags: ["india", "ai-market", "industry"],
    region: "India"
  },
  {
    name: "Smashing Magazine",
    type: SOURCE_TYPES.BLOG,
    baseUrl: "https://www.smashingmagazine.com",
    feedUrl: "https://www.smashingmagazine.com/feed/",
    category: CONTENT_CATEGORIES.DESIGN_IMPACT,
    tags: ["product-design", "ux", "design-systems"],
    region: "Global"
  },
  {
    name: "UX Collective",
    type: SOURCE_TYPES.BLOG,
    baseUrl: "https://uxdesign.cc",
    feedUrl: "https://uxdesign.cc/feed",
    category: CONTENT_CATEGORIES.DESIGN_IMPACT,
    tags: ["medium", "ux", "product-design"],
    region: "Global"
  },
  {
    name: "Product Hunt AI",
    type: SOURCE_TYPES.COMMUNITY,
    baseUrl: "https://www.producthunt.com",
    feedUrl: "https://www.producthunt.com/feed?category=artificial-intelligence",
    category: CONTENT_CATEGORIES.TOOL,
    tags: ["tool-discovery", "launches"],
    region: "USA"
  },
  {
    name: "Figma Blog",
    type: SOURCE_TYPES.BLOG,
    baseUrl: "https://www.figma.com",
    feedUrl: "https://www.figma.com/blog/rss.xml",
    enabled: false,
    category: CONTENT_CATEGORIES.DESIGN_IMPACT,
    tags: ["product-design", "design-systems"],
    region: "USA"
  },
  {
    name: "Adobe Blog",
    type: SOURCE_TYPES.BLOG,
    baseUrl: "https://blog.adobe.com",
    feedUrl: "https://blog.adobe.com/en/topics/design/feed",
    enabled: false,
    category: CONTENT_CATEGORIES.DESIGN_IMPACT,
    tags: ["adobe", "design-tools", "creative-workflows"],
    region: "USA"
  },
  {
    name: "Nielsen Norman Group",
    type: SOURCE_TYPES.BLOG,
    baseUrl: "https://www.nngroup.com",
    feedUrl: "https://www.nngroup.com/feed/rss/",
    category: CONTENT_CATEGORIES.DESIGN_IMPACT,
    tags: ["ux", "research"],
    region: "USA"
  },
  {
    name: "Atlassian Design Blog",
    type: SOURCE_TYPES.BLOG,
    baseUrl: "https://www.atlassian.com",
    feedUrl: "https://www.atlassian.com/blog/design/feed",
    category: CONTENT_CATEGORIES.DESIGN_IMPACT,
    tags: ["atlassian", "design-teams", "ai-adoption"],
    region: "USA"
  },
  {
    name: "Atlassian AI Blog",
    type: SOURCE_TYPES.BLOG,
    baseUrl: "https://www.atlassian.com",
    feedUrl: "https://www.atlassian.com/blog/artificial-intelligence/feed",
    category: CONTENT_CATEGORIES.WORKFLOW,
    tags: ["atlassian", "ai-workflows", "product-teams"],
    region: "USA"
  },
  {
    name: "Lenny's Newsletter",
    type: SOURCE_TYPES.BLOG,
    baseUrl: "https://www.lennysnewsletter.com",
    feedUrl: "https://www.lennysnewsletter.com/feed",
    category: CONTENT_CATEGORIES.WORKFLOW,
    tags: ["substack", "product-teams", "adoption"],
    region: "USA"
  },
  {
    name: "Dribbble Stories",
    type: SOURCE_TYPES.BLOG,
    baseUrl: "https://dribbble.com",
    feedUrl: "https://dribbble.com/stories.rss",
    category: CONTENT_CATEGORIES.DESIGN_IMPACT,
    tags: ["dribbble", "design-community", "visual-design"],
    region: "USA"
  }
];

export const jobSources: JobSourceConfig[] = [
  { company: "OpenAI", boardUrl: "https://boards.greenhouse.io/openai", type: "greenhouse", enabled: false },
  { company: "Anthropic", boardUrl: "https://boards.greenhouse.io/anthropic", type: "greenhouse" },
  { company: "Figma", boardUrl: "https://boards.greenhouse.io/figma", type: "greenhouse" },
  { company: "Miro", boardUrl: "https://boards.greenhouse.io/miro", type: "greenhouse", enabled: false },
  { company: "Notion", boardUrl: "https://boards.greenhouse.io/notion", type: "greenhouse", enabled: false },
  {
    company: "Microsoft",
    boardUrl: "https://jobs.careers.microsoft.com/global/en/search",
    searchUrl: "https://jobs.careers.microsoft.com/global/en/search?q=product%20designer",
    type: "career-portal"
  },
  {
    company: "Atlassian",
    boardUrl: "https://www.atlassian.com/company/careers/all-jobs",
    searchUrl: "https://www.atlassian.com/company/careers/all-jobs?search=designer",
    type: "career-portal"
  },
  {
    company: "IBM",
    boardUrl: "https://www.ibm.com/careers/search",
    searchUrl: "https://www.ibm.com/careers/search?field_keyword_18[0]=designer",
    type: "career-portal"
  },
  {
    company: "Salesforce",
    boardUrl: "https://careers.salesforce.com/en/jobs/",
    searchUrl: "https://careers.salesforce.com/en/jobs/?search=designer",
    type: "career-portal"
  },
  {
    company: "Google",
    boardUrl: "https://www.google.com/about/careers/applications/jobs/results/",
    searchUrl: "https://www.google.com/about/careers/applications/jobs/results/?q=designer",
    type: "career-portal"
  },
  {
    company: "Meta",
    boardUrl: "https://www.metacareers.com/jobs/",
    searchUrl: "https://www.metacareers.com/jobs/?q=designer",
    type: "career-portal"
  },
  {
    company: "Amazon",
    boardUrl: "https://www.amazon.jobs/en/search",
    searchUrl: "https://www.amazon.jobs/en/search?base_query=ux%20designer",
    type: "career-portal"
  },
  {
    company: "Apple",
    boardUrl: "https://jobs.apple.com/en-us/search",
    searchUrl: "https://jobs.apple.com/en-us/search?search=designer",
    type: "career-portal"
  }
];

export const relevantJobTerms = [
  "product designer",
  "ux designer",
  "ui designer",
  "ui/ux designer",
  "ux/ui designer",
  "design systems specialist",
  "design system specialist",
  "design lead",
  "design leader",
  "head of design",
  "design director",
  "staff product designer",
  "principal product designer",
  "product design manager",
  "design manager",
  "design systems lead",
  "design systems manager",
  "design systems",
  "research",
  "prototype",
  "ai",
  "machine learning",
  "conversation design",
  "service design",
  "design operations"
];
