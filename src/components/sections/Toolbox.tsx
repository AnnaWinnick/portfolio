import prisma from "@/lib/prisma";
import { ToolboxContent } from "./ToolboxContent";

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
      <ToolboxContent sortedCategories={sortedCategories} />
    </div>
  );
}
