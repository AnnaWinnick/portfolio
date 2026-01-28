import prisma from "@/lib/prisma";
import { IdeaCard } from "./IdeaCard";

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
        <h2 className="display-md text-[var(--foreground)]">Ideas</h2>
      </div>

      {/* Ideas list */}
      {ideas.length === 0 ? (
        <div className="bg-[var(--color-pale-blue)]/50 rounded-xl p-8 text-center">
          <p className="text-[var(--foreground-muted)]">Ideas brewing...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ideas.map((idea, index) => (
            <IdeaCard
              key={idea.id}
              title={idea.title}
              description={idea.description}
              createdAt={idea.createdAt}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
