import { prisma } from "../lib/db";
import { CONTENT_CATEGORIES, SOURCE_TYPES } from "../lib/constants";

async function main() {
  const source = await prisma.source.upsert({
    where: {
      name_baseUrl: {
        name: "Seed Intelligence",
        baseUrl: "https://example.com"
      }
    },
    update: {},
    create: {
      name: "Seed Intelligence",
      type: SOURCE_TYPES.RSS,
      baseUrl: "https://example.com",
      feedUrl: "https://example.com/feed.xml"
    }
  });

  await prisma.contentItem.upsert({
    where: {
      fullUrl: "https://example.com/ai-design-signal"
    },
    update: {},
    create: {
      title: "AI-assisted prototyping is moving from experiment to expectation",
      summary:
        "Seed content used only for local setup. Once ingestion runs, real items replace the need for this bootstrap record.",
      fullUrl: "https://example.com/ai-design-signal",
      sourceName: source.name,
      sourceId: source.id,
      category: CONTENT_CATEGORIES.DESIGN_IMPACT,
      subcategory: "seed",
      tags: ["seed", "prototyping", "design"],
      relevanceScore: 70,
      trendScore: 55,
      contentType: "article",
      extractedSkills: ["prototyping", "systems thinking"],
      extractedTools: ["figma", "chatgpt"],
      extractedCompanies: ["example"]
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
