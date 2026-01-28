"use client";

import { useRef, useEffect } from "react";
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
  index,
}: SkillCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  // Calculate days since started
  const daysSinceStart = Math.floor(
    (Date.now() - new Date(startedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate "active" status based on last update (within 7 days)
  const isActive =
    Date.now() - new Date(lastUpdatedAt).getTime() < 7 * 24 * 60 * 60 * 1000;

  const formatDistanceToNow = (date: Date) => {
    const days = Math.floor(
      (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days === 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

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
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: index * 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 95%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, [index]);

  return (
    <article
      ref={cardRef}
      className="group flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-[var(--color-lavender)]/30 transition-colors"
      style={{ opacity: 0 }}
    >
      {/* Active indicator */}
      <div className="pt-1.5">
        {isActive ? (
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-secondary)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--accent-secondary)]" />
          </span>
        ) : (
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--foreground)]/20" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent-primary)] transition-colors leading-tight">
          {name}
        </h3>
        {notes && (
          <p className="text-sm text-[var(--foreground-muted)] mt-1 line-clamp-1">
            {notes}
          </p>
        )}
        <p className="font-mono text-xs text-[var(--foreground-muted)] mt-1">
          {daysSinceStart} days · Updated {formatDistanceToNow(lastUpdatedAt)}
        </p>
      </div>
    </article>
  );
}
