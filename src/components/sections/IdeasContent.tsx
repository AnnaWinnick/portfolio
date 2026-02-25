"use client";

import { useAdmin } from "@/providers/AdminProvider";
import { addIdea, toggleArchiveIdea, deleteIdea } from "@/app/actions/ideas";
import { IdeaCard } from "./IdeaCard";
import { useRef } from "react";

interface Idea {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  isArchived: boolean;
}

export function IdeasContent({ ideas }: { ideas: Idea[] }) {
  const { isAdmin, isEditing } = useAdmin();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      {/* Ideas list */}
      {ideas.length === 0 ? (
        <div className="bg-[var(--color-pale-blue)]/50 rounded-xl p-8 text-center">
          <p className="text-[var(--foreground-muted)]">Ideas brewing...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ideas.map((idea) => (
            <div key={idea.id} className="group/edit relative">
              <IdeaCard
                title={idea.title}
                createdAt={idea.createdAt}
              />

              {/* Edit controls overlay */}
              {isAdmin && isEditing && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/edit:opacity-100 transition-opacity">
                  <form action={toggleArchiveIdea}>
                    <input type="hidden" name="id" value={idea.id} />
                    <input type="hidden" name="archived" value={String(idea.isArchived)} />
                    <button
                      type="submit"
                      className="px-2 py-1 text-xs font-mono rounded bg-[var(--foreground-muted)]/10 hover:bg-[var(--foreground-muted)]/20 text-[var(--foreground-muted)] transition-colors"
                    >
                      {idea.isArchived ? "Restore" : "Archive"}
                    </button>
                  </form>
                  <form action={deleteIdea}>
                    <input type="hidden" name="id" value={idea.id} />
                    <button
                      type="submit"
                      className="px-2 py-1 text-xs font-mono rounded bg-red-500/10 hover:bg-red-500/20 text-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add idea form — only in edit mode */}
      {isAdmin && isEditing && (
        <form
          ref={formRef}
          action={async (formData) => {
            await addIdea(formData);
            formRef.current?.reset();
          }}
          className="mt-6 p-4 border border-dashed border-[var(--accent-primary)]/30 rounded-xl space-y-3"
        >
          <input
            name="title"
            placeholder="New idea title..."
            required
            className="w-full px-3 py-2 text-sm bg-transparent border border-[var(--foreground-muted)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-primary)]/50"
          />
          <input
            name="description"
            placeholder="Private notes (optional)"
            className="w-full px-3 py-2 text-sm bg-transparent border border-[var(--foreground-muted)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-primary)]/50"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium bg-[var(--accent-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Add Idea
          </button>
        </form>
      )}
    </>
  );
}
