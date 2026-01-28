import { getBooks } from "@/lib/goodreads";
import { BookshelfClient } from "./BookshelfClient";

export async function Bookshelf() {
  const books = await getBooks();

  const currentlyReading = books
    .filter((b) => b.status === "reading")
    .map((b) => ({ ...b, rating: b.rating }));
  const finished = books
    .filter((b) => b.status === "finished")
    .map((b) => ({ ...b, rating: b.rating }));

  if (books.length === 0) {
    return (
      <div className="py-16 sm:py-20">
        <div className="container-wide">
          <div className="max-w-5xl">
            {/* Section header */}
            <div className="mb-10 sm:mb-16">
              <span className="font-mono text-xs sm:text-sm text-[var(--foreground-dark-muted)] uppercase tracking-wider mb-4 block">
                via Goodreads
              </span>
              <h2 className="display-sm text-[var(--foreground-dark)]">Bookshelf</h2>
              <p className="body-lg text-[var(--foreground-dark-muted)] mt-4 max-w-2xl">
                What I&apos;m reading and recently finished.
              </p>
            </div>

            {/* Empty state */}
            <div className="glass-dark p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-[var(--foreground-dark-muted)]/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <p className="body-lg text-[var(--foreground-dark-muted)]">
                Connecting to Goodreads...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BookshelfClient
      currentlyReading={currentlyReading}
      finished={finished}
    />
  );
}
