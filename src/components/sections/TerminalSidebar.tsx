import { getTopTrack } from "@/lib/spotify";
import { getRecentCommits } from "@/lib/github";

export async function TerminalSidebar() {
  const topTrack = await getTopTrack();
  const commits = await getRecentCommits("annawinnick", 3);

  return (
    <aside className="space-y-6">
      {/* Spotify Top Song - Glassmorphism */}
      <div className="glass-dark p-5 hover-lift">
        <div className="flex items-start gap-4">
          {topTrack?.albumArt ? (
            <img
              src={topTrack.albumArt}
              alt={`${topTrack.name} album art`}
              className="w-12 h-12 rounded-lg shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-[var(--accent-secondary)]/20 flex items-center justify-center shrink-0">
              <span className="text-[var(--accent-secondary)] text-lg">♪</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="font-mono text-xs text-[var(--accent-secondary)] uppercase tracking-wider mb-1">
              Top Song This Month
            </p>
            {topTrack ? (
              <a
                href={topTrack.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <p className="font-medium text-[var(--foreground-dark)] truncate group-hover:text-[var(--accent-primary)] transition-colors">
                  {topTrack.name}
                </p>
                <p className="text-sm text-[var(--foreground-dark-muted)] truncate">
                  {topTrack.artist}
                </p>
              </a>
            ) : (
              <p className="text-[var(--foreground-dark-muted)]">Not connected to Spotify</p>
            )}
          </div>
        </div>
        <p className="text-xs text-[var(--foreground-dark-muted)]/60 mt-3 font-mono">via Spotify API</p>
      </div>

      {/* GitHub Activity - Glassmorphism */}
      <div className="glass-dark p-5 hover-lift">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-[var(--accent-secondary)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span className="font-mono text-xs text-[var(--accent-secondary)] uppercase tracking-wider">
            Recent Commits
          </span>
        </div>
        {commits.length > 0 ? (
          <div className="space-y-2">
            {commits.map((commit) => (
              <a
                key={commit.sha + commit.date.getTime()}
                href={commit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <code className="text-xs text-[var(--accent-primary)] font-mono shrink-0">
                    {commit.sha}
                  </code>
                  <span className="text-sm text-[var(--foreground-dark)] line-clamp-1">
                    {commit.message}
                  </span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-[var(--foreground-dark-muted)]">No recent commits</p>
        )}
        <p className="text-xs text-[var(--foreground-dark-muted)]/60 mt-3 font-mono">via GitHub API</p>
      </div>

    </aside>
  );
}
