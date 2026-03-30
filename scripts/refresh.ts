import { ingestAllSources } from "../lib/ingestion/pipeline";
import { prisma } from "../lib/db";

async function main() {
  const startedAt = new Date();
  console.log(`[refresh] starting at ${startedAt.toISOString()}`);
  const result = await ingestAllSources();
  console.log(JSON.stringify(result, null, 2));
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
