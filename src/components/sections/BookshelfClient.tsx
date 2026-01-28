"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Book {
  title: string;
  author: string;
  coverUrl?: string;
  goodreadsUrl: string;
  status: "reading" | "finished";
}

interface BookshelfClientProps {
  currentlyReading: Book[];
  finished: Book[];
}

function BookCard({
  book,
  index,
  size = "large",
}: {
  book: Book;
  index: number;
  size?: "large" | "small";
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(ref.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Entry animation
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 90%",
          },
        }
      );

      // Subtle parallax on scroll
      gsap.to(ref.current, {
        y: 20 * (0.3 + (index % 3) * 0.15),
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [index]);

  const sizeClasses =
    size === "large"
      ? "w-32 sm:w-40 h-48 sm:h-60"
      : "w-24 sm:w-32 h-36 sm:h-48";

  return (
    <a
      ref={ref}
      href={book.goodreadsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex-shrink-0 group block ${sizeClasses} relative`}
      style={{ opacity: 0 }}
    >
      {book.coverUrl ? (
        <img
          src={book.coverUrl}
          alt={book.title}
          loading="lazy"
          className="w-full h-full object-cover rounded-sm shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 flex items-center justify-center rounded-sm border border-[var(--foreground-dark)]/20">
          <span className="text-xs text-[var(--foreground-dark-muted)] text-center px-2 line-clamp-3">
            {book.title}
          </span>
        </div>
      )}

      {/* Hover overlay with book info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <p className="text-white text-sm font-medium line-clamp-2 mb-1">
          {book.title}
        </p>
        <p className="text-white/70 text-xs line-clamp-1">{book.author}</p>
        <span className="inline-flex items-center gap-1 mt-2 text-xs text-[var(--accent-secondary)]">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View on Goodreads
        </span>
      </div>
    </a>
  );
}

export function BookshelfClient({
  currentlyReading,
  finished,
}: BookshelfClientProps) {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="py-16 sm:py-20">
      <div className="container-wide">
        {/* Section header */}
        <div ref={headerRef} className="mb-12 sm:mb-16 max-w-5xl" style={{ opacity: 0 }}>
          <span className="font-mono text-xs sm:text-sm text-[var(--foreground-dark-muted)] uppercase tracking-wider mb-4 block">
            via Goodreads
          </span>
          <h2 className="display-lg text-[var(--foreground-dark)]">Bookshelf</h2>
          <p className="body-lg text-[var(--foreground-dark-muted)] mt-4 max-w-2xl">
            What I&apos;m reading and recently finished.
          </p>
        </div>

        {/* Currently Reading */}
        {currentlyReading.length > 0 && (
          <div className="mb-12 sm:mb-16">
            <h3 className="font-mono text-xs sm:text-sm text-[var(--accent-primary)] uppercase tracking-wider mb-6 sm:mb-8">
              Currently Reading
            </h3>
            <div className="flex flex-wrap gap-4 sm:gap-6 items-end">
              {currentlyReading.map((book, i) => (
                <BookCard
                  key={book.goodreadsUrl}
                  book={book}
                  index={i}
                  size="large"
                />
              ))}
            </div>
          </div>
        )}

        {/* Recently Finished - Horizontal scroll on mobile */}
        {finished.length > 0 && (
          <div>
            <h3 className="font-mono text-xs sm:text-sm text-[var(--accent-secondary)] uppercase tracking-wider mb-6 sm:mb-8">
              Recently Finished
            </h3>
            <div className="overflow-x-auto -mx-[var(--grid-gutter)] px-[var(--grid-gutter)] sm:overflow-visible sm:mx-0 sm:px-0">
              <div className="flex gap-4 sm:gap-6 sm:flex-wrap items-end min-w-max sm:min-w-0">
                {finished.map((book, i) => (
                  <BookCard
                    key={book.goodreadsUrl}
                    book={book}
                    index={i + currentlyReading.length}
                    size="small"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Goodreads link */}
        <div className="mt-12 sm:mt-16">
          <a
            href="https://www.goodreads.com/user/show/184203247-anna-winnick"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors font-medium"
          >
            <span>View full library on Goodreads</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
