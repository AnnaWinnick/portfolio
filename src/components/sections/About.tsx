"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AboutProps {
  name?: string;
  title?: string;
  bio?: string;
  imageUrl?: string;
  resumeUrl?: string;
}

export function About({
  name = "Anna Winnick",
  title = "Creative Platform Engineer",
  bio = "I'm a platform engineer with a passion for creativity. When I'm not building infrastructure or automating deployments, you'll find me painting, crocheting, or exploring new hobbies. I believe that creativity and engineering go hand in hand—both require problem-solving, experimentation, and a willingness to iterate until you get it right.",
  imageUrl,
  resumeUrl = "/resume.pdf",
}: AboutProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 85%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="container-wide">
      <div
        ref={contentRef}
        className="grid gap-8 lg:gap-12 lg:grid-cols-[1fr_2fr] items-center"
        style={{ opacity: 0 }}
      >
        {/* Image */}
        <div className="hidden lg:block">
          {imageUrl ? (
            <div className="aspect-square max-w-xs overflow-hidden rounded-2xl">
              <img
                src={imageUrl}
                alt={name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-square max-w-xs bg-gradient-to-br from-[var(--color-lavender)] to-[var(--color-pale-blue)] rounded-2xl flex items-center justify-center">
              <svg
                className="w-16 h-16 text-[var(--foreground-muted)]/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <span className="font-mono text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2 block">
            About me
          </span>
          <h2 className="display-md mb-2">{name}</h2>
          <p className="font-mono text-sm text-[var(--accent-primary)] mb-4">
            {title}
          </p>
          <p className="body-md text-[var(--foreground-muted)] leading-relaxed mb-6">
            {bio}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <a
              href={resumeUrl}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-primary)] text-white text-sm font-medium rounded-lg hover-lift"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Resume
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--foreground)]/20 text-sm font-medium rounded-lg hover:bg-[var(--foreground)]/5 transition-colors"
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
