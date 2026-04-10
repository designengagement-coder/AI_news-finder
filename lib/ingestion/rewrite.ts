import { CONTENT_CATEGORIES, type ContentCategory } from "@/lib/constants";

const designIntentKeywords = [
  "design",
  "designer",
  "ux",
  "ui",
  "research",
  "prototype",
  "workflow",
  "product team",
  "figma",
  "design system",
  "interaction",
  "usability",
  "creative",
  "human-ai"
];

const genericNoiseKeywords = [
  "funding",
  "valuation",
  "stock",
  "earnings",
  "lawsuit",
  "policy",
  "regulation",
  "geopolitics",
  "chip",
  "gpu",
  "datacenter",
  "infrastructure",
  "benchmark"
];

export function isDirectDesignSignal(title: string, summary: string, category: ContentCategory, tags: string[]) {
  const corpus = `${title} ${summary} ${tags.join(" ")}`.toLowerCase();

  if (
    category === CONTENT_CATEGORIES.JOB ||
    category === CONTENT_CATEGORIES.DESIGN_IMPACT ||
    category === CONTENT_CATEGORIES.WORKFLOW ||
    category === CONTENT_CATEGORIES.TOOL
  ) {
    return true;
  }

  return designIntentKeywords.some((keyword) => corpus.includes(keyword));
}

export function isGenericNoise(title: string, summary: string, tags: string[]) {
  const corpus = `${title} ${summary} ${tags.join(" ")}`.toLowerCase();
  const hasDesignContext = designIntentKeywords.some((keyword) => corpus.includes(keyword));

  return !hasDesignContext && genericNoiseKeywords.some((keyword) => corpus.includes(keyword));
}

export function shouldRewriteIndirectSignal(title: string, summary: string, category: ContentCategory, tags: string[]) {
  const corpus = `${title} ${summary} ${tags.join(" ")}`.toLowerCase();
  const hasAiContext = corpus.includes("ai") || corpus.includes("agent") || corpus.includes("automation");
  const hasDesignContext = designIntentKeywords.some((keyword) => corpus.includes(keyword));

  return hasAiContext && !hasDesignContext && !isGenericNoise(title, summary, tags) && category !== CONTENT_CATEGORIES.JOB;
}

type RewriteResult = {
  rewrittenSummary: string;
  rewrittenTags: string[];
  rationale: string;
};

type ToolUseCaseResult = {
  designerUseCase: string;
  rationale: string;
};

type EditorialDecision = {
  keep: boolean;
  isDirectDesignSignal: boolean;
  rewrittenSummary: string;
  rewrittenTags: string[];
  rationale: string;
};

function extractResponseText(payload: any) {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const joined = (payload?.output ?? [])
    .flatMap((item: any) => item?.content ?? [])
    .map((content: any) => content?.text ?? "")
    .filter(Boolean)
    .join("\n");

  return joined.trim();
}

export async function rewriteForDesignContext(input: {
  title: string;
  summary: string;
  sourceName: string;
  category: ContentCategory;
  tags: string[];
}): Promise<RewriteResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const model = process.env.OPENAI_REWRITE_MODEL || "gpt-5";
  const prompt = [
    "You are rewriting AI industry news for a product design intelligence dashboard.",
    "Do not invent facts.",
    "If the story has only indirect relevance, explain the likely implication for product design teams, UX, workflows, prototyping, design systems, or design leadership.",
    "Keep the summary under 220 characters.",
    "Return strict JSON with keys: rewrittenSummary, rewrittenTags, rationale."
  ].join(" ");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      instructions: prompt,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify(input)
            }
          ]
        }
      ],
      max_output_tokens: 220
    })
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  const text = extractResponseText(payload);

  if (!text) {
    return null;
  }

  try {
    const parsed = JSON.parse(text) as RewriteResult;
    if (!parsed.rewrittenSummary) {
      return null;
    }
    return {
      rewrittenSummary: parsed.rewrittenSummary,
      rewrittenTags: Array.isArray(parsed.rewrittenTags) ? parsed.rewrittenTags : [],
      rationale: parsed.rationale ?? "AI rewrite applied for design context."
    };
  } catch {
    return null;
  }
}

export async function editorialReviewForDesign(input: {
  title: string;
  summary: string;
  sourceName: string;
  category: ContentCategory;
  tags: string[];
}): Promise<EditorialDecision | null> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const model = process.env.OPENAI_REWRITE_MODEL || "gpt-5";
  const prompt = [
    "You are an editor for an AI intelligence dashboard used by product design teams.",
    "Your job is to filter out garbage, generic, or low-value AI news.",
    "Keep only stories directly relevant to product design, UX, UI, design systems, workflows, prototyping, design leadership, or jobs shaping these roles.",
    "If a story is indirectly relevant but still useful, rewrite the summary so it clearly explains the implication for product and design teams.",
    "If the story is generic market noise, funding noise, pure infra noise, or not useful to product designers, set keep to false.",
    "Do not invent facts.",
    "Return strict JSON with keys: keep, isDirectDesignSignal, rewrittenSummary, rewrittenTags, rationale."
  ].join(" ");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      instructions: prompt,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify(input)
            }
          ]
        }
      ],
      max_output_tokens: 260
    })
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  const text = extractResponseText(payload);

  if (!text) {
    return null;
  }

  try {
    const parsed = JSON.parse(text) as EditorialDecision;
    if (typeof parsed.keep !== "boolean") {
      return null;
    }

    return {
      keep: parsed.keep,
      isDirectDesignSignal: Boolean(parsed.isDirectDesignSignal),
      rewrittenSummary: parsed.rewrittenSummary || input.summary,
      rewrittenTags: Array.isArray(parsed.rewrittenTags) ? parsed.rewrittenTags : [],
      rationale: parsed.rationale || "Editorial AI review applied."
    };
  } catch {
    return null;
  }
}

export async function enrichToolUseCase(input: {
  title: string;
  summary: string;
  sourceName: string;
  tags: string[];
}): Promise<ToolUseCaseResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const model = process.env.OPENAI_REWRITE_MODEL || "gpt-5";
  const prompt = [
    "You are enriching an AI tools feed for product design teams.",
    "Write one specific design-use-case statement for the tool.",
    "Avoid generic phrases like faster ideation unless they are directly justified by the tool context.",
    "Focus on what a product designer, UX designer, researcher, prototyper, content designer, or design systems lead could actually do with it.",
    "Keep the response under 150 characters.",
    "Return strict JSON with keys: designerUseCase, rationale."
  ].join(" ");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      instructions: prompt,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify(input)
            }
          ]
        }
      ],
      max_output_tokens: 140
    })
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  const text = extractResponseText(payload);

  if (!text) {
    return null;
  }

  try {
    const parsed = JSON.parse(text) as ToolUseCaseResult;
    if (!parsed.designerUseCase) {
      return null;
    }

    return {
      designerUseCase: parsed.designerUseCase,
      rationale: parsed.rationale || "Tool use case enriched."
    };
  } catch {
    return null;
  }
}
