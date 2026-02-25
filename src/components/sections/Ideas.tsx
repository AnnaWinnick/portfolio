import prisma from "@/lib/prisma";
import { IdeasContent } from "./IdeasContent";

export async function Ideas() {
  const ideas = await prisma.idea.findMany({
    where: { isArchived: false },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div>
      {/* Section header */}
      <div className="mb-6 sm:mb-8">
        <span className="font-mono text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2 block">
          What I&apos;m thinking about
        </span>
        <h2 className="display-sm text-[var(--foreground)]">Ideas</h2>
      </div>

      <IdeasContent ideas={ideas} />
    </div>
  );
}
