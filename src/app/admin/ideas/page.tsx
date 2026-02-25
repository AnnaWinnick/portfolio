import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { addIdea, toggleArchiveIdea, deleteIdea } from "@/app/actions/ideas";

export default async function IdeasAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const ideas = await prisma.idea.findMany({
    orderBy: { createdAt: "desc" },
  });

  const activeIdeas = ideas.filter((i) => !i.isArchived);
  const archivedIdeas = ideas.filter((i) => i.isArchived);

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
          <h1 className="mt-4">Ideas</h1>
          <p className="text-[var(--foreground-muted)]">
            Manage your running ideas list (titles are public, descriptions are private)
          </p>
        </header>

        {/* Add new idea form */}
        <form action={addIdea} className="p-6 bg-[var(--background-alt)] rounded-lg space-y-4">
          <h3>Add Idea</h3>
          <input
            name="title"
            placeholder="Idea title (visible publicly)"
            required
            className="w-full px-4 py-2 border border-[var(--foreground-muted)]/20 rounded bg-[var(--background)]"
          />
          <textarea
            name="description"
            placeholder="Private notes (only visible to you)"
            rows={3}
            className="w-full px-4 py-2 border border-[var(--foreground-muted)]/20 rounded bg-[var(--background)]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--accent)] text-white rounded hover:opacity-90"
          >
            Add Idea
          </button>
        </form>

        {/* Active ideas */}
        <section className="space-y-4">
          <h3>Active Ideas ({activeIdeas.length})</h3>
          {activeIdeas.length === 0 ? (
            <p className="text-[var(--foreground-muted)]">No active ideas.</p>
          ) : (
            <ul className="space-y-3">
              {activeIdeas.map((idea) => (
                <li
                  key={idea.id}
                  className="p-4 border border-[var(--foreground-muted)]/20 rounded-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium">{idea.title}</p>
                      {idea.description && (
                        <p className="text-sm text-[var(--foreground-muted)] mt-1">
                          {idea.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <form action={toggleArchiveIdea}>
                        <input type="hidden" name="id" value={idea.id} />
                        <input type="hidden" name="archived" value="false" />
                        <button
                          type="submit"
                          className="text-sm text-[var(--foreground-muted)] hover:underline"
                        >
                          Archive
                        </button>
                      </form>
                      <form action={deleteIdea}>
                        <input type="hidden" name="id" value={idea.id} />
                        <button
                          type="submit"
                          className="text-sm text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Archived ideas */}
        {archivedIdeas.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-[var(--foreground-muted)]">
              Archived ({archivedIdeas.length})
            </h3>
            <ul className="space-y-2 opacity-60">
              {archivedIdeas.map((idea) => (
                <li
                  key={idea.id}
                  className="p-3 border border-[var(--foreground-muted)]/10 rounded flex items-center justify-between"
                >
                  <span className="line-through">{idea.title}</span>
                  <form action={toggleArchiveIdea}>
                    <input type="hidden" name="id" value={idea.id} />
                    <input type="hidden" name="archived" value="true" />
                    <button
                      type="submit"
                      className="text-sm text-[var(--foreground-muted)] hover:underline"
                    >
                      Restore
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
