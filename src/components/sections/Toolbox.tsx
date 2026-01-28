import prisma from "@/lib/prisma";

export async function Toolbox() {
  const tools = await prisma.tool.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  // Group tools by category
  const categories = tools.reduce(
    (acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = [];
      }
      acc[tool.category].push(tool);
      return acc;
    },
    {} as Record<string, typeof tools>
  );

  const categoryOrder = ["Languages", "Infrastructure", "Tools", "Platforms"];
  const sortedCategories = Object.entries(categories).sort(([a], [b]) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  if (sortedCategories.length === 0) {
    return (
      <div>
        <h2 className="display-sm mb-8">Toolbox</h2>
        <p className="body-md text-[var(--foreground)]/70">
          Tech stack coming soon...
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="display-sm mb-12">Toolbox</h2>
      <div className="grid gap-8 sm:grid-cols-2">
        {sortedCategories.map(([category, categoryTools]) => (
          <div key={category}>
            <h4 className="font-mono text-xs text-[var(--foreground)]/60 uppercase tracking-wider mb-4">
              {category}
            </h4>
            <ul className="space-y-2">
              {categoryTools.map((tool) => (
                <li
                  key={tool.id}
                  className="flex items-center gap-3 text-[var(--foreground)] group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-poppy)] group-hover:scale-150 transition-transform" />
                  <span className="group-hover:text-[var(--color-poppy)] transition-colors">
                    {tool.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
