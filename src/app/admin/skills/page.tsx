import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { formatDistanceToNow, isOverdue } from "@/lib/utils";
import { addSkill, updateSkill, deleteSkill } from "@/app/actions/skills";

export default async function SkillsAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const skills = await prisma.skill.findMany({
    include: { SkillPhoto: { orderBy: { createdAt: "desc" } } },
    orderBy: { lastUpdatedAt: "desc" },
  });

  // Get reminder threshold from settings (default 14 days)
  const reminderSetting = await prisma.setting.findUnique({
    where: { key: "reminder_days" },
  });
  const reminderDays = reminderSetting ? parseInt(reminderSetting.value) : 14;

  return (
    <main className="min-h-screen px-6 py-16 md:px-12 lg:px-24">
      <div className="max-w-2xl mx-auto space-y-8">
        <header>
          <a
            href="/admin"
            className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          >
            &larr; Back to Dashboard
          </a>
          <h1 className="mt-4">Skills I&apos;m Growing</h1>
          <p className="text-[var(--foreground-muted)]">
            Track your learning progress. Update notes to reset the &quot;last updated&quot; timer.
          </p>
        </header>

        {/* Add new skill form */}
        <form action={addSkill} className="p-6 bg-[var(--background-alt)] rounded-lg space-y-4">
          <h3>Start Learning Something New</h3>
          <input
            name="name"
            placeholder="Skill name (e.g., Rust, Watercolor)"
            required
            className="w-full px-4 py-2 border border-[var(--foreground-muted)]/20 rounded bg-[var(--background)]"
          />
          <textarea
            name="notes"
            placeholder="Initial notes or goals"
            rows={2}
            className="w-full px-4 py-2 border border-[var(--foreground-muted)]/20 rounded bg-[var(--background)]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--accent)] text-white rounded hover:opacity-90"
          >
            Add Skill
          </button>
        </form>

        {/* Current skills */}
        <section className="space-y-4">
          <h3>Active Skills ({skills.length})</h3>
          {skills.length === 0 ? (
            <p className="text-[var(--foreground-muted)]">No skills being tracked yet.</p>
          ) : (
            <ul className="space-y-4">
              {skills.map((skill) => {
                const overdue = isOverdue(skill.lastUpdatedAt, reminderDays);
                return (
                  <li
                    key={skill.id}
                    className={`p-4 border rounded-lg ${
                      overdue
                        ? "border-[var(--accent)] bg-[var(--accent)]/5"
                        : "border-[var(--foreground-muted)]/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="font-medium">{skill.name}</p>
                        <p className="text-xs text-[var(--foreground-muted)]">
                          Started {skill.startedAt.toLocaleDateString()} &bull;{" "}
                          <span className={overdue ? "text-[var(--accent)] font-semibold" : ""}>
                            Updated {formatDistanceToNow(skill.lastUpdatedAt)}
                          </span>
                        </p>
                      </div>
                      {overdue && (
                        <span className="text-xs px-2 py-1 bg-[var(--accent)] text-white rounded">
                          Needs update!
                        </span>
                      )}
                    </div>

                    <form action={updateSkill} className="space-y-3">
                      <input type="hidden" name="id" value={skill.id} />
                      <textarea
                        name="notes"
                        defaultValue={skill.notes || ""}
                        placeholder="Update your progress notes..."
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-[var(--foreground-muted)]/20 rounded bg-[var(--background)]"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-3 py-1.5 text-sm bg-[var(--terminal-bg)] text-[var(--terminal-fg)] rounded hover:opacity-90"
                        >
                          Update Progress
                        </button>
                        <form action={deleteSkill} className="inline">
                          <input type="hidden" name="id" value={skill.id} />
                          <button
                            type="submit"
                            className="px-3 py-1.5 text-sm text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </form>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
