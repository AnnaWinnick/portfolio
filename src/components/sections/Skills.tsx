import prisma from "@/lib/prisma";
import { SkillCard } from "./SkillCard";

export async function Skills() {
  const skills = await prisma.skill.findMany({
    include: { SkillPhoto: { take: 1, orderBy: { createdAt: "desc" } } },
    orderBy: { lastUpdatedAt: "desc" },
    take: 4,
  });

  return (
    <div>
      {/* Section header */}
      <div className="mb-6 sm:mb-8">
        <span className="font-mono text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2 block">
          Accountability tracker
        </span>
        <h2 className="display-sm text-[var(--foreground)]">
          Skills I&apos;m Growing
        </h2>
      </div>

      {/* Skills list */}
      {skills.length === 0 ? (
        <div className="bg-[var(--color-lavender)]/50 rounded-xl p-8 text-center">
          <p className="text-[var(--foreground-muted)]">Learning journey starting soon...</p>
        </div>
      ) : (
        <div className="space-y-4">
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
  );
}
