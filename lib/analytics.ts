import { Prisma } from "@prisma/client";
import { CONTENT_CATEGORIES } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { asRecord, asStringArray } from "@/lib/serializers";
import { FilterState } from "@/lib/types";
import { timeframeStart } from "@/lib/utils";

const designKeywords = [
  "design",
  "designer",
  "ux",
  "research",
  "prototype",
  "figma",
  "workflow",
  "product",
  "team",
  "trust",
  "evaluation",
  "interaction"
];

function countryPriority(region?: string | null) {
  const normalized = (region ?? "").toLowerCase();

  if (normalized.includes("india")) {
    return 38;
  }

  if (
    normalized.includes("united states") ||
    normalized.includes("usa") ||
    normalized.includes("us") ||
    normalized.includes("san francisco") ||
    normalized.includes("new york")
  ) {
    return 42;
  }

  return region ? 8 : 0;
}

function designerUseCase(summary: string, tags: string[]) {
  const corpus = `${summary} ${tags.join(" ")}`.toLowerCase();

  if (corpus.includes("research")) {
    return "Useful for research synthesis and insight clustering.";
  }
  if (corpus.includes("prototype") || corpus.includes("build")) {
    return "Useful for quick prototyping and concept exploration.";
  }
  if (corpus.includes("writing") || corpus.includes("copy")) {
    return "Useful for UX writing and interface content iteration.";
  }
  if (corpus.includes("system") || corpus.includes("design-systems")) {
    return "Useful for design-system documentation and component thinking.";
  }

  return "Useful for faster ideation, iteration, and design workflow support.";
}

function buildWhere(filters: FilterState): Prisma.ContentItemWhereInput {
  const from = timeframeStart(filters.timeframe);
  return {
    ...(filters.q
        ? {
          OR: [
            { title: { contains: filters.q } },
            { summary: { contains: filters.q } }
          ]
        }
      : {}),
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.sourceType ? { source: { type: filters.sourceType } } : {}),
    ...(from ? { publishedAt: { gte: from } } : {})
  };
}

function orderBy(sort?: FilterState["sort"]): Prisma.ContentItemOrderByWithRelationInput[] {
  switch (sort) {
    case "trending":
      return [{ trendScore: "desc" }, { publishedAt: "desc" }];
    case "relevance":
      return [{ relevanceScore: "desc" }, { publishedAt: "desc" }];
    default:
      return [{ publishedAt: "desc" }, { fetchedAt: "desc" }];
  }
}

function andWhere(
  ...clauses: Array<Prisma.ContentItemWhereInput | undefined>
): Prisma.ContentItemWhereInput {
  const filtered = clauses.filter(
    (clause): clause is Prisma.ContentItemWhereInput => Boolean(clause && Object.keys(clause).length > 0)
  );

  if (filtered.length === 0) {
    return {};
  }

  if (filtered.length === 1) {
    return filtered[0];
  }

  return { AND: filtered };
}

export async function getDashboardData(filters: FilterState = {}) {
  const where = buildWhere(filters);
  const [focusedPool, toolsRaw, workflowsRaw, jobsRaw, designImpactRaw, marketSignalsRaw, sourceCount, itemCount, lastItem] =
    await Promise.all([
      prisma.contentItem.findMany({
        where: andWhere(where, {
          OR: [
            { category: CONTENT_CATEGORIES.JOB },
            { category: CONTENT_CATEGORIES.TOOL },
            { category: CONTENT_CATEGORIES.WORKFLOW },
            { category: CONTENT_CATEGORIES.DESIGN_IMPACT }
          ]
        }),
        orderBy: orderBy(filters.sort),
        take: 80
      }),
      prisma.contentItem.findMany({
        where: { ...where, category: CONTENT_CATEGORIES.TOOL },
        orderBy: [{ trendScore: "desc" }, { publishedAt: "desc" }],
        take: 20
      }),
      prisma.contentItem.findMany({
        where: { ...where, category: CONTENT_CATEGORIES.WORKFLOW },
        orderBy: [{ trendScore: "desc" }, { publishedAt: "desc" }],
        take: 20
      }),
      prisma.contentItem.findMany({
        where: { ...where, category: CONTENT_CATEGORIES.JOB },
        orderBy: [{ trendScore: "desc" }, { publishedAt: "desc" }],
        take: 20
      }),
      prisma.contentItem.findMany({
        where: { ...where, category: CONTENT_CATEGORIES.DESIGN_IMPACT },
        orderBy: [{ trendScore: "desc" }, { publishedAt: "desc" }],
        take: 20
      }),
      prisma.contentItem.findMany({
        where: andWhere(where, {
          OR: [
            { category: CONTENT_CATEGORIES.JOB },
            { category: CONTENT_CATEGORIES.DESIGN_IMPACT },
            { category: CONTENT_CATEGORIES.WORKFLOW }
          ]
        }),
        orderBy: [{ relevanceScore: "desc" }, { trendScore: "desc" }],
        take: 20
      }),
      prisma.source.count({ where: { active: true } }),
      prisma.contentItem.count({ where }),
      prisma.contentItem.findFirst({ orderBy: [{ fetchedAt: "desc" }] })
    ]);

  const normalizeItem = (item: (typeof focusedPool)[number]) => ({
    ...item,
    tags: asStringArray(item.tags),
    extractedSkills: asStringArray(item.extractedSkills),
    extractedTools: asStringArray(item.extractedTools),
    extractedCompanies: asStringArray(item.extractedCompanies),
    metadata: asRecord(item.metadata),
    toolLogoUrl: asRecord(item.metadata)?.imageUrl as string | undefined,
    designerUseCase: designerUseCase(item.summary, asStringArray(item.tags))
  });

  const isDesignFocused = (item: ReturnType<typeof normalizeItem>) => {
    const corpus = `${item.title} ${item.summary} ${item.tags.join(" ")}`.toLowerCase();
    return (
      item.category === CONTENT_CATEGORIES.JOB ||
      item.category === CONTENT_CATEGORIES.DESIGN_IMPACT ||
      item.category === CONTENT_CATEGORIES.WORKFLOW ||
      item.category === CONTENT_CATEGORIES.TOOL ||
      designKeywords.some((keyword) => corpus.includes(keyword))
    );
  };

  const rankPriority = (item: ReturnType<typeof normalizeItem>) => {
    const categoryWeight =
      item.category === CONTENT_CATEGORIES.JOB
        ? 160
        : item.category === CONTENT_CATEGORIES.DESIGN_IMPACT
          ? 125
          : item.category === CONTENT_CATEGORIES.TOOL
            ? 95
            : item.category === CONTENT_CATEGORIES.WORKFLOW
              ? 85
              : 40;

    const keywordLift = designKeywords.reduce(
      (score, keyword) =>
        item.title.toLowerCase().includes(keyword) || item.summary.toLowerCase().includes(keyword)
          ? score + 6
          : score,
      0
    );

    return categoryWeight + item.trendScore + item.relevanceScore + keywordLift + countryPriority(item.region);
  };

  const focusedItems = focusedPool.map(normalizeItem).filter(isDesignFocused).sort((a, b) => rankPriority(b) - rankPriority(a));
  const jobs = jobsRaw.map(normalizeItem).filter(isDesignFocused).sort((a, b) => rankPriority(b) - rankPriority(a));
  const tools = toolsRaw.map(normalizeItem).filter(isDesignFocused).sort((a, b) => rankPriority(b) - rankPriority(a));
  const workflows = workflowsRaw.map(normalizeItem).filter(isDesignFocused).sort((a, b) => rankPriority(b) - rankPriority(a));
  const designImpact = designImpactRaw.map(normalizeItem).filter(isDesignFocused).sort((a, b) => rankPriority(b) - rankPriority(a));
  const marketSignals = marketSignalsRaw
    .map(normalizeItem)
    .filter(isDesignFocused)
    .sort((a, b) => rankPriority(b) - rankPriority(a));

  const priorityNews = [...jobs, ...designImpact]
    .filter(isDesignFocused)
    .sort((a, b) => rankPriority(b) - rankPriority(a))
    .slice(0, 10);

  const launchedTools = tools
    .filter((item) => {
      const corpus = `${item.title} ${item.summary} ${item.tags.join(" ")}`.toLowerCase();
      return (
        corpus.includes("launch") ||
        corpus.includes("new") ||
        corpus.includes("product hunt") ||
        corpus.includes("release") ||
        corpus.includes("announce")
      );
    })
    .slice(0, 10);

  const headlineSource = priorityNews[0] ?? tools[0] ?? workflows[0] ?? focusedItems[0] ?? null;
  const headlineTicker = headlineSource
    ? headlineSource.title
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 6)
        .join(" ")
    : "Design AI signals still loading";

  return {
    priorityNews,
    tools: tools.slice(0, 10),
    launchedTools,
    jobs: jobs.slice(0, 10),
    workflows: workflows.slice(0, 10),
    designImpact: designImpact.slice(0, 10),
    marketSignals: marketSignals.slice(0, 8),
    headlineTicker,
    refreshStatus: {
      lastUpdated: lastItem?.fetchedAt.toISOString() ?? null,
      sourceCount,
      itemCount
    }
  };
}

function countTokens(
  items: Array<{ extractedSkills: unknown; extractedTools: unknown; extractedCompanies: unknown }>
) {
  const skills = new Map<string, number>();
  const tools = new Map<string, number>();
  const companies = new Map<string, number>();

  for (const item of items) {
    for (const value of asStringArray(item.extractedSkills)) {
      skills.set(value, (skills.get(value) ?? 0) + 1);
    }
    for (const value of asStringArray(item.extractedTools)) {
      tools.set(value, (tools.get(value) ?? 0) + 1);
    }
    for (const value of asStringArray(item.extractedCompanies)) {
      companies.set(value, (companies.get(value) ?? 0) + 1);
    }
  }

  const toTop = (map: Map<string, number>) =>
    [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([label, count]) => ({ label, count }));

  return {
    topSkills: toTop(skills),
    topTools: toTop(tools),
    topCompanies: toTop(companies)
  };
}

export async function getInsights() {
  const [jobItems, designItems, workflowItems] = await Promise.all([
    prisma.contentItem.findMany({
      where: { category: CONTENT_CATEGORIES.JOB },
      orderBy: { publishedAt: "desc" },
      take: 40
    }),
    prisma.contentItem.findMany({
      where: { category: CONTENT_CATEGORIES.DESIGN_IMPACT },
      orderBy: { publishedAt: "desc" },
      take: 40
    }),
    prisma.contentItem.findMany({
      where: { category: CONTENT_CATEGORIES.WORKFLOW },
      orderBy: { publishedAt: "desc" },
      take: 40
    })
  ]);

  const counts = countTokens([...jobItems, ...designItems, ...workflowItems]);
  const recurringThemes = [
    "Designers are expected to reason about AI system behavior, not just screens.",
    "Prompt literacy and workflow automation are recurring differentiators in both jobs and articles.",
    "Teams are operationalizing AI in research synthesis, prototyping, and documentation."
  ];

  return {
    ...counts,
    recurringThemes,
    recommendedLearning: [
      "Run prompt-and-evaluation exercises inside your design process.",
      "Practice AI-assisted prototyping in Figma, Framer, or code-based tools.",
      "Build stronger systems thinking around orchestration, trust, and handoff."
    ]
  };
}
