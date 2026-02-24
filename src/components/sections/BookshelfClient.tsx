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
  rating?: number;
  startedAt?: string;
}

interface BookshelfClientProps {
  currentlyReading: Book[];
  finished: Book[];
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "xs" }) {
  const sizeClass = size === "sm" ? "w-3 h-3" : "w-2.5 h-2.5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClass} ${star <= rating ? "text-[var(--accent-secondary)]" : "text-white/20"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function BookCard({
  book,
  index,
}: {
  book: Book;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={ref}
      className="flex-shrink-0 group flex flex-col items-center"
      style={{ opacity: 0 }}
    >
      {/* Book cover */}
      <a
        href={book.goodreadsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-auto h-32 sm:h-40 aspect-[2/3] relative transition-transform duration-300 group-hover:-translate-y-3"
      >
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            loading="lazy"
            className="w-full h-full object-cover rounded-sm shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 flex items-center justify-center rounded-sm border border-[var(--foreground-dark)]/20">
            <span className="text-xs text-[var(--foreground-dark-muted)] text-center px-2 line-clamp-3">
              {book.title}
            </span>
          </div>
        )}
      </a>

      {/* Star rating or start date - shows underneath on hover */}
      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-[1.5rem] flex items-center justify-center">
        {book.status === "reading" && book.startedAt ? (
          <div className="text-center">
            <span className="block text-[10px] text-[var(--foreground-dark-muted)] font-mono uppercase tracking-wider">
              Started
            </span>
            <span className="block text-xs text-[var(--foreground-dark-muted)] font-mono">
              {book.startedAt}
            </span>
          </div>
        ) : book.rating && book.rating > 0 ? (
          <StarRating rating={book.rating} size="xs" />
        ) : (
          <span className="text-[10px] text-[var(--foreground-dark-muted)]/50 font-mono">Unrated</span>
        )}
      </div>
    </div>
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
    <div className="py-12 sm:py-16">
      <div className="container-wide">
        {/* Section header */}
        <div ref={headerRef} className="mb-6 sm:mb-8" style={{ opacity: 0 }}>
          <span className="font-mono text-xs text-[var(--foreground-dark-muted)] uppercase tracking-wider mb-2 block">
            via Goodreads
          </span>
          <h2 className="display-sm text-[var(--foreground-dark)]">Bookshelf</h2>
        </div>

        {/* Side by side sections */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Currently Reading */}
          {currentlyReading.length > 0 && (
            <div>
              <h3 className="font-mono text-xs text-[var(--accent-primary)] uppercase tracking-wider mb-4">
                Currently Reading
              </h3>
              <div className="overflow-x-auto overflow-y-visible -mx-[var(--grid-gutter)] px-[var(--grid-gutter)] pb-6">
                <div className="flex gap-4 items-end min-w-max" style={{ minHeight: "14rem" }}>
                  {currentlyReading.map((book, i) => (
                    <BookCard
                      key={book.goodreadsUrl}
                      book={book}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recently Finished */}
          {finished.length > 0 && (
            <div>
              <h3 className="font-mono text-xs text-[var(--accent-secondary)] uppercase tracking-wider mb-4">
                Recently Finished
              </h3>
              <div className="overflow-x-auto overflow-y-visible -mx-[var(--grid-gutter)] px-[var(--grid-gutter)] pb-6">
                <div className="flex gap-4 items-end min-w-max" style={{ minHeight: "14rem" }}>
                  {finished.map((book, i) => (
                    <BookCard
                      key={book.goodreadsUrl}
                      book={book}
                      index={i + currentlyReading.length}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Goodreads link */}
        <div className="mt-6 sm:mt-8">
          <a
            href="https://www.goodreads.com/user/show/184203247-anna-winnick"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors font-medium"
          >
            <span>View full library on Goodreads</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
