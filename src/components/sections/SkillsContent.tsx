"use client";

import { useAdmin } from "@/providers/AdminProvider";
import { addSkill, deleteSkill } from "@/app/actions/skills";
import { SkillCard } from "./SkillCard";
import { MediaPicker } from "@/components/ui/MediaPicker";
import { useRef, useState } from "react";

interface Skill {
  id: string;
  name: string;
  notes: string | null;
  startedAt: Date;
  lastUpdatedAt: Date;
  photoUrl?: string | null;
}

export function SkillsContent({ skills }: { skills: Skill[] }) {
  const { isAdmin, isEditing } = useAdmin();
  const formRef = useRef<HTMLFormElement>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [pickedMedia, setPickedMedia] = useState<{ id: string; url: string } | null>(null);

  return (
    <>
      {/* Skills list */}
      {skills.length === 0 ? (
        <div className="bg-[var(--color-lavender)]/50 rounded-xl p-8 text-center">
          <p className="text-[var(--foreground-muted)]">
            Learning journey starting soon...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div key={skill.id} className="group/edit relative">
              <SkillCard
                name={skill.name}
                notes={skill.notes}
                startedAt={skill.startedAt}
                lastUpdatedAt={skill.lastUpdatedAt}
                photoUrl={skill.photoUrl}
                index={index}
              />

              {/* Edit controls overlay */}
              {isAdmin && isEditing && (
                <div className="absolute top-2 right-2 opacity-0 group-hover/edit:opacity-100 transition-opacity">
                  <form action={deleteSkill}>
                    <input type="hidden" name="id" value={skill.id} />
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

      {/* Add skill form — only in edit mode */}
      {isAdmin && isEditing && (
        <form
          ref={formRef}
          action={async (formData) => {
            await addSkill(formData);
            formRef.current?.reset();
            setPickedMedia(null);
          }}
          className="mt-6 p-4 border border-dashed border-[var(--accent-primary)]/30 rounded-xl space-y-3"
        >
          <input
            name="name"
            placeholder="New skill name..."
            required
            className="w-full px-3 py-2 text-sm bg-transparent border border-[var(--foreground-muted)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-primary)]/50"
          />
          <input
            name="notes"
            placeholder="Initial notes (optional)"
            className="w-full px-3 py-2 text-sm bg-transparent border border-[var(--foreground-muted)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-primary)]/50"
          />

          {/* Optional photo via MediaPicker */}
          {pickedMedia ? (
            <div className="flex items-center gap-2">
              <img
                src={pickedMedia.url}
                alt="Selected"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => setPickedMedia(null)}
                className="text-xs text-red-500 hover:text-red-600"
              >
                Remove photo
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowMediaPicker(true)}
              className="px-3 py-2 text-sm bg-transparent border border-dashed border-[var(--foreground-muted)]/20 rounded-lg text-[var(--foreground-muted)] hover:border-[var(--accent-primary)]/30 transition-colors"
            >
              Add photo (optional)
            </button>
          )}
          <input type="hidden" name="photoUrl" value={pickedMedia?.url || ""} />
          <input type="hidden" name="mediaId" value={pickedMedia?.id || ""} />

          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium bg-[var(--accent-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Add Skill
          </button>
        </form>
      )}

      {/* MediaPicker Modal */}
      {showMediaPicker && (
        <MediaPicker
          onSelect={(media) => {
            setPickedMedia(media);
            setShowMediaPicker(false);
          }}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
    </>
  );
}
