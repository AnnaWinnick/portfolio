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
      className="group flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-[var(--color-pale-blue)]/30 transition-colors cursor-pointer"
      style={{ opacity: 0 }}
    >
      {/* Number */}
      <span className="font-mono text-sm text-[var(--accent-primary)] opacity-60 pt-0.5">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent-primary)] transition-colors leading-tight">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-[var(--foreground-muted)] mt-1 line-clamp-1">
            {description}
          </p>
        )}
      </div>

      {/* Date */}
      <span className="font-mono text-xs text-[var(--foreground-muted)] shrink-0">
        {formatDate(createdAt)}
      </span>
    </article>
  );
}
