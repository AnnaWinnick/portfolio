import prisma from "@/lib/prisma";
import { IdeasContent } from "./IdeasContent";

export async function Ideas() {
  const ideas = await prisma.idea.findMany({
    where: { isArchived: false },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return (
    <div className="bg-gradient-to-b from-[var(--color-pale-blue)]/40 to-transparent rounded-2xl p-6">
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
