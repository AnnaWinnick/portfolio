"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface IdeaCardProps {
  title: string;
  description?: string | null;
  createdAt: Date;
  index: number;
}

export function IdeaCard({ title, description, createdAt, index }: IdeaCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  useEffect(() => {
    if (!cardRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(cardRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 90%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, [index]);

  return (
    <article
      ref={cardRef}
      className="group relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 hover-lift border border-[var(--foreground)]/5 cursor-pointer"
      style={{ opacity: 0 }}
    >
      {/* Number badge */}
      <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-[var(--accent-primary)] flex items-center justify-center shadow-lg">
        <span className="font-mono text-sm font-bold text-white">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Content */}
      <div className="pt-2">
        <h3 className="display-sm mb-3 group-hover:text-[var(--accent-primary)] transition-colors pr-4">
          {title}
        </h3>

        {description && (
          <p className="body-md text-[var(--foreground-muted)] mb-4 line-clamp-3">
            {description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--foreground)]/10">
          <span className="font-mono text-xs text-[var(--foreground-muted)]">
            {formatDate(createdAt)}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-[var(--accent-primary)] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Read more
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}
