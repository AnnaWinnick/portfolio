import { fetchSubstackPosts } from "@/lib/substack";

export async function SubstackPosts() {
  const posts = await fetchSubstackPosts(3);

  if (posts.length === 0) {
    return (
      <section>
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="display-sm">Writing</h2>
          <a
            href="https://threescompany.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-[var(--color-poppy)] hover:underline"
          >
            View on Substack →
          </a>
        </div>
        <p className="body-md text-[var(--foreground-muted)]">
          Posts loading...
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-baseline justify-between mb-12">
        <h2 className="display-sm">Writing</h2>
        <a
          href="https://threescompany.substack.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-[var(--color-poppy)] hover:underline"
        >
          View all →
        </a>
      </div>
      <div className="space-y-6">
        {posts.map((post) => (
          <a
            key={post.url}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <time className="font-mono text-xs text-[var(--foreground-muted)] mb-2 block">
              {post.publishedAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <h4 className="text-xl font-semibold group-hover:text-[var(--color-poppy)] transition-colors mb-2">
              {post.title}
            </h4>
            {post.excerpt && (
              <p className="body-md text-[var(--foreground-muted)] line-clamp-2">
                {post.excerpt}
              </p>
            )}
            <div className="h-px bg-[var(--foreground)]/10 mt-6" />
          </a>
        ))}
      </div>
    </section>
  );
}
