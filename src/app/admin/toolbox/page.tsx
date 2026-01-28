import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function ToolboxAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const tools = await prisma.tool.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  async function addTool(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;

    if (!name || !category) return;

    await prisma.tool.create({
      data: { id: crypto.randomUUID(), name, category },
    });
    revalidatePath("/admin/toolbox");
    revalidatePath("/");
  }

  async function deleteTool(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;

    await prisma.tool.delete({ where: { id } });
    revalidatePath("/admin/toolbox");
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
          <h1 className="mt-4">Toolbox</h1>
          <p className="text-[var(--foreground-muted)]">
            Manage your tech stack and proficiencies
          </p>
        </header>

        {/* Add new tool form */}
        <form action={addTool} className="p-6 bg-[var(--background-alt)] rounded-lg space-y-4">
          <h3>Add Tool</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="name"
              placeholder="Tool name (e.g., Docker)"
              required
              className="px-4 py-2 border border-[var(--foreground-muted)]/20 rounded bg-[var(--background)]"
            />
            <select
              name="category"
              required
              className="px-4 py-2 border border-[var(--foreground-muted)]/20 rounded bg-[var(--background)]"
            >
              <option value="">Select category</option>
              <option value="Languages">Languages</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Tools">Tools</option>
              <option value="Platforms">Platforms</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--accent)] text-white rounded hover:opacity-90"
          >
            Add Tool
          </button>
        </form>

        {/* Current tools list */}
        <section className="space-y-4">
          <h3>Current Tools ({tools.length})</h3>
          {tools.length === 0 ? (
            <p className="text-[var(--foreground-muted)]">No tools added yet.</p>
          ) : (
            <ul className="divide-y divide-[var(--foreground-muted)]/10">
              {tools.map((tool) => (
                <li key={tool.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-medium">{tool.name}</span>
                    <span className="ml-2 text-sm text-[var(--foreground-muted)]">
                      {tool.category}
                    </span>
                  </div>
                  <form action={deleteTool}>
                    <input type="hidden" name="id" value={tool.id} />
                    <button
                      type="submit"
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
