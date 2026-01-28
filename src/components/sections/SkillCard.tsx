"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SkillCardProps {
  name: string;
  notes?: string | null;
  startedAt: Date;
  lastUpdatedAt: Date;
  photoUrl?: string | null;
  index: number;
}

export function SkillCard({
  name,
  notes,
  startedAt,
  lastUpdatedAt,
  photoUrl,
  index,
}: SkillCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Calculate days since started and progress percentage (max 365 days = 100%)
  const daysSinceStart = Math.floor(
    (Date.now() - new Date(startedAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  const progressPercent = Math.min((daysSinceStart / 365) * 100, 100);

  // Calculate "active" status based on last update (within 7 days)
  const isActive =
    Date.now() - new Date(lastUpdatedAt).getTime() < 7 * 24 * 60 * 60 * 1000;

  // Format date for display
  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });

  const formatDistanceToNow = (date: Date) => {
    const days = Math.floor(
      (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days === 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  useEffect(() => {
    if (!cardRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      if (progressRef.current) {
        gsap.set(progressRef.current, { width: `${progressPercent}%` });
      }
      return;
    }

    // Card reveal animation
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            onEnter: () => setIsVisible(true),
          },
        }
      );
    });

    return () => ctx.revert();
  }, [index, progressPercent]);

  // Animate progress bar when visible
  useEffect(() => {
    if (!isVisible || !progressRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    gsap.fromTo(
      progressRef.current,
      { width: 0 },
      {
        width: `${progressPercent}%`,
        duration: 1,
        delay: 0.3,
        ease: "power2.out",
      }
    );
  }, [isVisible, progressPercent]);

  return (
    <article
      ref={cardRef}
      className="group relative bg-white/50 backdrop-blur-sm rounded-2xl p-6 hover-lift border border-[var(--foreground)]/5"
      style={{ opacity: 0 }}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-secondary)] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--accent-secondary)]" />
          </span>
          <span className="font-mono text-xs text-[var(--accent-secondary)]">
            Active
          </span>
        </div>
      )}

      {/* Skill image */}
      {photoUrl ? (
        <div className="aspect-video mb-5 overflow-hidden rounded-xl hover-zoom-img">
          <img
            src={photoUrl}
            alt={`${name} progress`}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video mb-5 bg-gradient-to-br from-[var(--color-lavender)] to-[var(--color-pale-blue)] flex items-center justify-center rounded-xl">
          <svg
            className="w-12 h-12 text-[var(--foreground-muted)]/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
      )}

      {/* Skill info */}
      <h3 className="display-sm mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
        {name}
      </h3>

      {notes && (
        <p className="body-md text-[var(--foreground-muted)] mb-4 line-clamp-2">
          {notes}
        </p>
      )}

      {/* Progress section */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[var(--foreground-muted)]">
            Learning for {daysSinceStart} days
          </span>
          <span className="text-[var(--accent-primary)]">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="h-2 bg-[var(--foreground)]/10 rounded-full overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full"
            style={{ width: 0 }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-[var(--foreground)]/10 flex items-center justify-between">
        <span className="font-mono text-xs text-[var(--foreground-muted)]">
          Started {formatDate(startedAt)}
        </span>
        <span className="font-mono text-xs text-[var(--foreground-muted)]">
          Updated {formatDistanceToNow(lastUpdatedAt)}
        </span>
      </div>
    </article>
  );
}
