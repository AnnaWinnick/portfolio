"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface IdeaCardProps {
  title: string;
  createdAt: Date;
}

export function IdeaCard({ title, createdAt }: IdeaCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  const formatRelativeDate = (date: Date) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
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
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 95%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <article
      ref={cardRef}
      className="bg-white rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
      style={{ opacity: 0 }}
    >
      <h3 className="font-semibold text-[var(--foreground)] leading-tight">
        {title}
      </h3>
      <span className="font-mono text-xs text-[var(--foreground-muted)] mt-1 block">
        {formatRelativeDate(createdAt)}
      </span>
    </article>
  );
}
