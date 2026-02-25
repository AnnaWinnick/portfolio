"use client";

import { useAdmin } from "@/providers/AdminProvider";
import { adminSignOut } from "@/app/actions/auth";

export function AdminBar() {
  const { isAdmin, isEditing, toggleEditing } = useAdmin();

  if (!isAdmin) {
    return (
      <a
        href="/admin/login"
        className="fixed bottom-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full text-[var(--foreground-muted)]/20 hover:text-[var(--foreground-muted)]/60 transition-colors"
        title="Admin"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </a>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-[var(--terminal-bg)] text-[var(--terminal-fg)] px-4 py-2 rounded-full shadow-lg font-mono text-sm">
      <button
        onClick={toggleEditing}
        className={`px-3 py-1 rounded-full transition-colors ${
          isEditing
            ? "bg-[var(--accent-primary)] text-white"
            : "hover:bg-white/10"
        }`}
      >
        {isEditing ? "Done" : "Edit"}
      </button>
      <div className="w-px h-4 bg-white/20" />
      <form action={adminSignOut}>
        <button
          type="submit"
          className="px-3 py-1 rounded-full hover:bg-white/10 transition-colors"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}
