import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { isOverdue, formatDistanceToNow } from "@/lib/utils";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  // Get content health stats
  const reminderSetting = await prisma.setting.findUnique({
    where: { key: "reminder_days" },
  });
  const reminderDays = reminderSetting ? parseInt(reminderSetting.value) : 14;

  const skills = await prisma.skill.findMany({
    select: { name: true, lastUpdatedAt: true },
  });
  const overdueSkills = skills.filter((s) => isOverdue(s.lastUpdatedAt, reminderDays));

  const ideasCount = await prisma.idea.count({ where: { isArchived: false } });
  const toolsCount = await prisma.tool.count();
  const imagesCount = await prisma.hobbyImage.count();

  return (
    <main className="min-h-screen px-6 py-16 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="text-[var(--foreground-muted)]">
              Signed in as {session.user.email}
            </p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="px-4 py-2 text-sm border border-[var(--foreground-muted)]/20 rounded hover:bg-[var(--background-alt)]"
            >
              Sign out
            </button>
          </form>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AdminCard
            title="Ideas"
            description="Manage your public ideas list"
            href="/admin/ideas"
            count={ideasCount}
          />
          <AdminCard
            title="Skills"
            description="Track skills you're learning"
            href="/admin/skills"
            count={skills.length}
            alert={overdueSkills.length > 0}
          />
          <AdminCard
            title="Hobbies Gallery"
            description="Upload creative hobby photos"
            href="/admin/hobbies"
            count={imagesCount}
          />
          <AdminCard
            title="Toolbox"
            description="Manage your tech stack"
            href="/admin/toolbox"
            count={toolsCount}
          />
          <AdminCard
            title="Settings"
            description="Configure reminders and nudges"
            href="/admin/settings"
          />
        </div>

        {/* Content Health */}
        <section className="p-6 bg-[var(--background-alt)] rounded-lg space-y-4">
          <h3>Content Health</h3>
          {overdueSkills.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[var(--accent)] font-medium">
                {overdueSkills.length} skill{overdueSkills.length > 1 ? "s" : ""} need updating!
              </p>
              <ul className="space-y-1">
                {overdueSkills.map((skill) => (
                  <li key={skill.name} className="text-sm flex justify-between">
                    <span>{skill.name}</span>
                    <span className="text-[var(--foreground-muted)]">
                      {formatDistanceToNow(skill.lastUpdatedAt)}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href="/admin/skills"
                className="inline-block mt-2 text-sm text-[var(--accent)] hover:underline"
              >
                Update skills →
              </a>
            </div>
          ) : skills.length > 0 ? (
            <p className="text-[var(--terminal-green)]">
              ✓ All skills are up to date!
            </p>
          ) : (
            <p className="text-[var(--foreground-muted)]">
              Add skills to start tracking your learning progress.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

function AdminCard({
  title,
  description,
  href,
  count,
  alert,
}: {
  title: string;
  description: string;
  href: string;
  count?: number;
  alert?: boolean;
}) {
  return (
    <a
      href={href}
      className={`block p-6 border rounded-lg hover:bg-[var(--background-alt)] transition-colors ${
        alert
          ? "border-[var(--accent)] bg-[var(--accent)]/5"
          : "border-[var(--foreground-muted)]/20 hover:border-[var(--accent)]"
      }`}
    >
      <div className="flex items-start justify-between">
        <h4 className="font-sans font-semibold">{title}</h4>
        {count !== undefined && (
          <span className="text-sm font-mono text-[var(--foreground-muted)]">
            {count}
          </span>
        )}
      </div>
      <p className="text-sm text-[var(--foreground-muted)] mt-1">
        {description}
      </p>
      {alert && (
        <p className="text-xs text-[var(--accent)] mt-2 font-medium">
          Needs attention
        </p>
      )}
    </a>
  );
}
