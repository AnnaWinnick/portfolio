"use client";

import { useAdmin } from "@/providers/AdminProvider";
import { addTool, deleteTool } from "@/app/actions/toolbox";
import { useRef } from "react";

interface Tool {
  id: string;
  name: string;
  category: string;
}

interface ToolboxContentProps {
  sortedCategories: [string, Tool[]][];
}

export function ToolboxContent({ sortedCategories }: ToolboxContentProps) {
  const { isAdmin, isEditing } = useAdmin();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
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
                  className="flex items-center gap-3 text-[var(--foreground)] group/tool"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-poppy)] group-hover/tool:scale-150 transition-transform" />
                  <span className="group-hover/tool:text-[var(--color-poppy)] transition-colors flex-1">
                    {tool.name}
                  </span>

                  {/* Delete control */}
                  {isAdmin && isEditing && (
                    <form
                      action={deleteTool}
                      className="opacity-0 group-hover/tool:opacity-100 transition-opacity"
                    >
                      <input type="hidden" name="id" value={tool.id} />
                      <button
                        type="submit"
                        className="px-2 py-0.5 text-xs font-mono rounded bg-red-500/10 hover:bg-red-500/20 text-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Add tool form — only in edit mode */}
      {isAdmin && isEditing && (
        <form
          ref={formRef}
          action={async (formData) => {
            await addTool(formData);
            formRef.current?.reset();
          }}
          className="mt-8 p-4 border border-dashed border-[var(--color-poppy)]/30 rounded-xl space-y-3"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="name"
              placeholder="Tool name..."
              required
              className="px-3 py-2 text-sm bg-transparent border border-[var(--foreground)]/20 rounded-lg focus:outline-none focus:border-[var(--color-poppy)]/50"
            />
            <select
              name="category"
              required
              className="px-3 py-2 text-sm bg-transparent border border-[var(--foreground)]/20 rounded-lg focus:outline-none focus:border-[var(--color-poppy)]/50"
            >
              <option value="">Select category</option>
              <option value="Languages">Languages</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Tools">Tools</option>
              <option value="Platforms">Platforms</option>
              <option value="AI">AI</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium bg-[var(--color-poppy)] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Add Tool
          </button>
        </form>
      )}
    </>
  );
}
