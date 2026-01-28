import prisma from "@/lib/prisma";
import { SkillCard } from "./SkillCard";

export async function Skills() {
  const skills = await prisma.skill.findMany({
    include: { SkillPhoto: { take: 1, orderBy: { createdAt: "desc" } } },
    orderBy: { lastUpdatedAt: "desc" },
  });

  return (
    <div className="py-16 sm:py-20 sm:min-h-screen sm:flex sm:flex-col sm:justify-center">
      <div className="container-wide">
        <div className="max-w-5xl">
          {/* Section header */}
          <div className="mb-10 sm:mb-16">
            <span className="font-mono text-xs sm:text-sm text-[var(--foreground-muted)] uppercase tracking-wider mb-4 block">
              Accountability tracker
            </span>
            <h2 className="display-lg text-[var(--foreground)]">
              Skills I&apos;m Growing
            </h2>
            <p className="body-lg text-[var(--foreground-muted)] mt-4 max-w-2xl">
              Tracking my learning journey with progress indicators and regular
              updates.
            </p>
          </div>

          {/* Skills grid */}
          {skills.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-[var(--foreground)]/5">
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <p className="body-lg text-[var(--foreground-muted)]">
                Learning journey starting soon...
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
              {skills.map((skill, index) => (
                <SkillCard
                  key={skill.id}
                  name={skill.name}
                  notes={skill.notes}
                  startedAt={skill.startedAt}
                  lastUpdatedAt={skill.lastUpdatedAt}
                  photoUrl={skill.SkillPhoto[0]?.url}
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
