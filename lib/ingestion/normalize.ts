import * as cheerio from "cheerio";
import { CONTENT_CATEGORIES, type ContentCategory } from "@/lib/constants";
import { cleanDisplayText, normalizeToken, truncate, unique } from "@/lib/utils";

const skillLexicon = [
  "prompt design",
  "systems thinking",
  "research synthesis",
  "prototyping",
  "evaluation",
  "trust and safety",
  "service design",
  "interaction design",
  "ux writing",
  "design systems",
  "figma",
  "framer",
  "python",
  "sql",
  "analytics",
  "workshop facilitation"
];

const toolLexicon = [
  "chatgpt",
  "claude",
  "figma",
  "cursor",
  "midjourney",
  "framer",
  "github copilot",
  "notion ai",
  "perplexity"
];

const companyLexicon = ["openai", "anthropic", "google", "meta", "microsoft", "figma", "notion", "miro"];

export function htmlToText(input?: string) {
  if (!input) {
    return "";
  }

  const $ = cheerio.load(input);
  return cleanDisplayText($.text());
}

export function summarize(input: string, max = 220) {
  const clean = cleanDisplayText(input);
  return truncate(clean, max);
}

function extractMatches(text: string, lexicon: string[]) {
  const normalized = normalizeToken(text);
  return unique(lexicon.filter((term) => normalized.includes(term)));
}

export function deriveCategory(title: string, summary: string, fallback: ContentCategory) {
  const corpus = normalizeToken(`${title} ${summary}`);

  if (corpus.includes("job") || corpus.includes("hiring") || corpus.includes("career")) {
    return CONTENT_CATEGORIES.JOB;
  }

  if (corpus.includes("workflow") || corpus.includes("how teams use") || corpus.includes("playbook")) {
    return CONTENT_CATEGORIES.WORKFLOW;
  }

  if (corpus.includes("designer") || corpus.includes("design") || corpus.includes("ux")) {
    return CONTENT_CATEGORIES.DESIGN_IMPACT;
  }

  if (corpus.includes("tool") || corpus.includes("launch") || corpus.includes("product hunt")) {
    return CONTENT_CATEGORIES.TOOL;
  }

  return fallback;
}

export function inferTags(title: string, summary: string, seedTags: string[]) {
  const corpus = normalizeToken(`${title} ${summary}`);
  const dynamicTags = [
    "agents",
    "design-systems",
    "ux-research",
    "prototyping",
    "ai-jobs",
    "upskilling",
    "model-release",
    "workflow-automation"
  ].filter((tag) => corpus.includes(tag.replace("-", " ")));

  return unique([...seedTags, ...dynamicTags]);
}

export function extractStructuredSignals(title: string, summary: string) {
  const text = `${title} ${summary}`;
  return {
    skills: extractMatches(text, skillLexicon),
    tools: extractMatches(text, toolLexicon),
    companies: extractMatches(text, companyLexicon)
  };
}
