import { Prisma } from "@prisma/client";
import { CONTENT_CATEGORIES } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { asRecord, asStringArray } from "@/lib/serializers";
import { DailyDigestPayload, FilterState } from "@/lib/types";
import { cleanDisplayText, timeframeStart } from "@/lib/utils";

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

function designerUseCase(title: string, summary: string, tags: string[]) {
  const corpus = `${title} ${summary} ${tags.join(" ")}`.toLowerCase();

  if (corpus.includes("research")) {
    return "Useful for research synthesis and insight clustering.";
  }
  if (corpus.includes("agent") || corpus.includes("automation")) {
    return "Useful for automating repetitive design ops and accelerating production workflows.";
  }
  if (corpus.includes("prototype") || corpus.includes("build")) {
    return "Useful for quick prototyping and concept exploration.";
  }
  if (corpus.includes("voice") || corpus.includes("audio")) {
    return "Useful for voice-interface concepts, multimodal flows, and conversational experience design.";
  }
  if (corpus.includes("writing") || corpus.includes("copy")) {
    return "Useful for UX writing and interface content iteration.";
  }
  if (corpus.includes("system") || corpus.includes("design-systems")) {
    return "Useful for design-system documentation and component thinking.";
  }
  if (corpus.includes("video") || corpus.includes("image") || corpus.includes("visual")) {
    return "Useful for rapid visual concepting, campaign mockups, and early creative direction.";
  }
  if (corpus.includes("evaluation") || corpus.includes("safety") || corpus.includes("trust")) {
    return "Useful for trust, safety, and evaluation flows in AI product experiences.";
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

function toDigestItem(item: {
  id: string;
  title: string;
  summary: string;
  fullUrl: string;
  sourceName: string;
  publishedAt: Date | null;
  tags: unknown;
}) {
  return {
    id: item.id,
    title: cleanDisplayText(item.title),
    summary: cleanDisplayText(item.summary),
    url: item.fullUrl,
    sourceName: item.sourceName,
    publishedAt: item.publishedAt?.toISOString() ?? null,
    tags: asStringArray(item.tags).slice(0, 4)
  };
}

function buildSlackSection(label: string, items: ReturnType<typeof toDigestItem>[]) {
  if (items.length === 0) {
    return `*${label}*\n- No updates today`;
  }

  return [
    `*${label}*`,
    ...items.map((item) => `- <${item.url}|${item.title}> — ${item.sourceName}`)
  ].join("\n");
}

export async function getDailyDigest(limit = 5): Promise<DailyDigestPayload> {
  const safeLimit = Math.min(Math.max(limit, 1), 10);
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const baseWhere: Prisma.ContentItemWhereInput = {
    OR: [{ publishedAt: { gte: startOfDay } }, { fetchedAt: { gte: startOfDay } }]
  };

  const [aiNewsRaw, aiToolsRaw, aiWorkflowsRaw, aiJobsRaw, lastItem] = await Promise.all([
    prisma.contentItem.findMany({
      where: andWhere(baseWhere, {
        OR: [
          { category: CONTENT_CATEGORIES.NEWS },
          { category: CONTENT_CATEGORIES.DESIGN_IMPACT },
          { category: CONTENT_CATEGORIES.MARKET_SIGNAL }
        ]
      }),
      orderBy: [{ publishedAt: "desc" }, { fetchedAt: "desc" }],
      take: safeLimit
    }),
    prisma.contentItem.findMany({
      where: andWhere(baseWhere, { category: CONTENT_CATEGORIES.TOOL }),
      orderBy: [{ publishedAt: "desc" }, { fetchedAt: "desc" }],
      take: safeLimit
    }),
    prisma.contentItem.findMany({
      where: andWhere(baseWhere, { category: CONTENT_CATEGORIES.WORKFLOW }),
      orderBy: [{ publishedAt: "desc" }, { fetchedAt: "desc" }],
      take: safeLimit
    }),
    prisma.contentItem.findMany({
      where: andWhere(baseWhere, { category: CONTENT_CATEGORIES.JOB }),
      orderBy: [{ publishedAt: "desc" }, { fetchedAt: "desc" }],
      take: safeLimit
    }),
    prisma.contentItem.findFirst({ orderBy: [{ fetchedAt: "desc" }] })
  ]);

  const sections = {
    aiNews: aiNewsRaw.map(toDigestItem),
    aiTools: aiToolsRaw.map(toDigestItem),
    aiWorkflows: aiWorkflowsRaw.map(toDigestItem),
    aiJobs: aiJobsRaw.map(toDigestItem)
  };

  return {
    generatedAt: now.toISOString(),
    date: startOfDay.toISOString().slice(0, 10),
    lastUpdated: lastItem?.fetchedAt.toISOString() ?? null,
    sections,
    slackText: [
      `*AI Trends Daily Digest*`,
      `_Updated: ${lastItem?.fetchedAt ? lastItem.fetchedAt.toISOString() : "unknown"}_`,
      "",
      buildSlackSection("AI News", sections.aiNews),
      "",
      buildSlackSection("AI Tools", sections.aiTools),
      "",
      buildSlackSection("AI Workflows", sections.aiWorkflows),
      "",
      buildSlackSection("AI Jobs", sections.aiJobs)
    ].join("\n")
  };
}

export async function getDashboardData(filters: FilterState = {}) {
  const where = buildWhere(filters);
  const [
    focusedPool,
    toolsRaw,
    workflowsRaw,
    jobsRaw,
    designImpactRaw,
    marketSignalsRaw,
    sourceCount,
    itemCount,
    lastItem,
    lastSuccessfulRun,
    failedRunsLast24h,
    latestFailure
  ] =
    await Promise.all([
      prisma.contentItem.findMany({
        where: andWhere(where, {
          OR: [
            { category: CONTENT_CATEGORIES.NEWS },
            { category: CONTENT_CATEGORIES.TOOL },
            { category: CONTENT_CATEGORIES.WORKFLOW },
            { category: CONTENT_CATEGORIES.DESIGN_IMPACT },
            { category: CONTENT_CATEGORIES.MARKET_SIGNAL }
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
      prisma.contentItem.findFirst({ orderBy: [{ fetchedAt: "desc" }] }),
      prisma.ingestionRun.findFirst({
        where: { status: "success", finishedAt: { not: null } },
        orderBy: { finishedAt: "desc" }
      }),
      prisma.ingestionRun.count({
        where: {
          status: "failed",
          startedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      }),
      prisma.ingestionRun.findFirst({
        where: { status: "failed" },
        orderBy: { finishedAt: "desc" }
      })
    ]);

  const normalizeItem = (item: (typeof focusedPool)[number]) => ({
    ...item,
    tags: asStringArray(item.tags),
    extractedSkills: asStringArray(item.extractedSkills),
    extractedTools: asStringArray(item.extractedTools),
    extractedCompanies: asStringArray(item.extractedCompanies),
    metadata: asRecord(item.metadata),
    toolLogoUrl: asRecord(item.metadata)?.imageUrl as string | undefined,
    designerUseCase:
      (asRecord(item.metadata)?.designerUseCase as string | undefined) ??
      designerUseCase(item.title, item.summary, asStringArray(item.tags))
  });

  const isDesignFocused = (item: ReturnType<typeof normalizeItem>) => {
    const corpus = `${item.title} ${item.summary} ${item.tags.join(" ")}`.toLowerCase();
    return (
      item.category === CONTENT_CATEGORIES.JOB ||
      item.category === CONTENT_CATEGORIES.NEWS ||
      item.category === CONTENT_CATEGORIES.MARKET_SIGNAL ||
      item.category === CONTENT_CATEGORIES.DESIGN_IMPACT ||
      item.category === CONTENT_CATEGORIES.WORKFLOW ||
      item.category === CONTENT_CATEGORIES.TOOL ||
      designKeywords.some((keyword) => corpus.includes(keyword))
    );
  };

  const isPriorityReadingSignal = (item: ReturnType<typeof normalizeItem>) =>
    item.category !== CONTENT_CATEGORIES.JOB &&
    item.category !== CONTENT_CATEGORIES.TOOL &&
    item.contentType !== "job" &&
    Boolean(item.fullUrl);

  const rankPriority = (item: ReturnType<typeof normalizeItem>) => {
    const categoryWeight =
      item.category === CONTENT_CATEGORIES.DESIGN_IMPACT
        ? 150
        : item.category === CONTENT_CATEGORIES.NEWS
          ? 125
          : item.category === CONTENT_CATEGORIES.WORKFLOW
            ? 110
            : item.category === CONTENT_CATEGORIES.MARKET_SIGNAL
              ? 95
              : item.category === CONTENT_CATEGORIES.TOOL
                ? 70
                : 20;

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

  const priorityNews = [...focusedItems, ...designImpact, ...workflows, ...marketSignals]
    .filter((item) => isDesignFocused(item) && isPriorityReadingSignal(item))
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
      itemCount,
      lastSuccessfulRun: lastSuccessfulRun?.finishedAt?.toISOString() ?? null,
      failedRunsLast24h,
      latestFailureMessage: latestFailure?.message ?? null
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
