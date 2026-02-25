import prisma from "@/lib/prisma";
import { isOverdue } from "@/lib/utils";
import { SkillsContent } from "./SkillsContent";

export async function Skills() {
  const skills = await prisma.skill.findMany({
    include: { SkillPhoto: { take: 1, orderBy: { createdAt: "desc" } } },
    orderBy: { lastUpdatedAt: "desc" },
    take: 4,
  });

  // Check if any skills are overdue for nudge button
  const reminderSetting = await prisma.setting.findUnique({
    where: { key: "reminder_days" },
  });
  const reminderDays = reminderSetting ? parseInt(reminderSetting.value) : 14;
  const hasOverdueSkills = skills.some((s) => isOverdue(s.lastUpdatedAt, reminderDays));

  const skillsData = skills.map((s) => ({
    id: s.id,
    name: s.name,
    notes: s.notes,
    startedAt: s.startedAt,
    lastUpdatedAt: s.lastUpdatedAt,
    photoUrl: s.SkillPhoto[0]?.url ?? null,
  }));

  return (
    <div className="bg-gradient-to-b from-[var(--color-lavender)]/40 to-transparent rounded-2xl p-6">
      {/* Section header */}
      <div className="mb-6 sm:mb-8">
        <span className="font-mono text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2 block">
          Accountability tracker
        </span>
        <h2 className="display-sm text-[var(--foreground)]">
          Skills I&apos;m Growing
        </h2>
      </div>

      <SkillsContent skills={skillsData} />

      {/* Nudge button - only shows when skills are overdue */}
      {hasOverdueSkills && (
        <form action="/api/nudge" method="POST" className="mt-6">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 rounded-full hover:bg-[var(--accent-primary)]/10 transition-colors"
          >
            <span>Nudge Me</span>
          </button>
          <span className="ml-2 text-xs text-[var(--foreground-muted)]/60 font-mono">via Resend API</span>
        </form>
      )}
    </div>
  );
}
