import prisma from "@/lib/prisma";
import { IdeaCard } from "./IdeaCard";

export async function Ideas() {
  const ideas = await prisma.idea.findMany({
    where: { isArchived: false },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="py-16 sm:py-20 sm:min-h-screen sm:flex sm:flex-col sm:justify-center">
      <div className="container-wide">
        <div className="max-w-5xl">
          {/* Section header */}
          <div className="mb-10 sm:mb-16">
            <span className="font-mono text-xs sm:text-sm text-[var(--foreground-muted)] uppercase tracking-wider mb-4 block">
              What I&apos;m thinking about
            </span>
            <h2 className="display-lg text-[var(--foreground)]">Ideas</h2>
            <p className="body-lg text-[var(--foreground-muted)] mt-4 max-w-2xl">
              Thoughts, inspirations, and things I&apos;m exploring.
            </p>
          </div>

          {/* Ideas grid */}
          {ideas.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-[var(--foreground)]/5">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-[var(--foreground-muted)]/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <p className="body-lg text-[var(--foreground-muted)]">
                Ideas brewing...
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
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
      </div>
    </div>
  );
}
