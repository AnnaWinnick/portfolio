import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function SettingsAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const reminderSetting = await prisma.setting.findUnique({
    where: { key: "reminder_days" },
  });
  const reminderDays = reminderSetting?.value || "14";

  async function updateSettings(formData: FormData) {
    "use server";
    const reminderDays = formData.get("reminder_days") as string;

    if (reminderDays) {
      await prisma.setting.upsert({
        where: { key: "reminder_days" },
        update: { value: reminderDays, updatedAt: new Date() },
        create: { key: "reminder_days", value: reminderDays, updatedAt: new Date() },
      });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/admin");
    revalidatePath("/");
  }

  return (
    <main className="min-h-screen px-6 py-16 md:px-12 lg:px-24">
      <div className="max-w-2xl mx-auto space-y-8">
        <header>
          <a
            href="/admin"
            className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          >
            ← Back to Dashboard
          </a>
          <h1 className="mt-4">Settings</h1>
          <p className="text-[var(--foreground-muted)]">
            Configure your portfolio accountability features
          </p>
        </header>

        <form action={updateSettings} className="space-y-6">
          {/* Reminder Settings */}
          <section className="p-6 bg-[var(--background-alt)] rounded-lg space-y-4">
            <h3>Accountability</h3>
            <div>
              <label
                htmlFor="reminder_days"
                className="block text-sm font-medium mb-2"
              >
                Skill update reminder (days)
              </label>
              <p className="text-sm text-[var(--foreground-muted)] mb-2">
                Send a reminder email if any skill hasn&apos;t been updated in this
                many days. Also shows the nudge button to visitors.
              </p>
              <input
                type="number"
                id="reminder_days"
                name="reminder_days"
                defaultValue={reminderDays}
                min="1"
                max="365"
                className="w-32 px-4 py-2 border border-[var(--foreground-muted)]/20 rounded bg-[var(--background)]"
              />
            </div>
          </section>

          <button
            type="submit"
            className="px-4 py-2 bg-[var(--accent)] text-white rounded hover:opacity-90"
          >
            Save Settings
          </button>
        </form>

        {/* API Documentation */}
        <section className="space-y-4">
          <h3>API Endpoints</h3>
          <div className="terminal space-y-4">
            <div>
              <p className="text-[var(--terminal-green)]"># Nudge API</p>
              <p className="terminal-prompt">
                curl -X POST {process.env.NEXTAUTH_URL || "https://yoursite.com"}
                /api/nudge
              </p>
              <p className="text-[var(--terminal-fg)]/60 text-sm">
                Rate limited: 3 per hour per IP
              </p>
            </div>
            <div>
              <p className="text-[var(--terminal-green)]"># Cron (with secret)</p>
              <p className="terminal-prompt">
                curl -H &quot;Authorization: Bearer $CRON_SECRET&quot;{" "}
                {process.env.NEXTAUTH_URL || "https://yoursite.com"}
                /api/cron/check-reminders
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
