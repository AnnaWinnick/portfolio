"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface AboutProps {
  name?: string;
  title?: string;
  bio?: string;
  imageUrl?: string;
  resumeUrl?: string;
  timeline?: TimelineItem[];
}

const defaultTimeline: TimelineItem[] = [
  {
    year: "Now",
    title: "Creative DevOps Engineer",
    description: "Building infrastructure and automation with a creative twist.",
  },
  {
    year: "2022",
    title: "DevOps Engineer",
    description: "Infrastructure as code, CI/CD pipelines, and cloud architecture.",
  },
  {
    year: "2020",
    title: "Platform Engineer",
    description: "Kubernetes, Docker, and developer experience improvements.",
  },
  {
    year: "2018",
    title: "Software Engineer",
    description: "Full-stack development with focus on backend systems.",
  },
];

export function About({
  name = "Anna Winnick",
  title = "Creative DevOps Engineer",
  bio = "I'm a DevOps engineer with a passion for creativity. When I'm not building infrastructure or automating deployments, you'll find me painting, crocheting, or exploring new hobbies. I believe that creativity and engineering go hand in hand—both require problem-solving, experimentation, and a willingness to iterate until you get it right.",
  imageUrl,
  resumeUrl = "/resume.pdf",
  timeline = defaultTimeline,
}: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Content fade in
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      // Timeline items stagger
      if (timelineRef.current) {
        const items = timelineRef.current.querySelectorAll(".timeline-item");
        gsap.fromTo(
          items,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 80%",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-20 sm:min-h-screen sm:flex sm:flex-col sm:justify-center"
    >
      <div className="container-wide">
        <div className="max-w-6xl">
          {/* Section header */}
          <div className="mb-10 sm:mb-16">
            <span className="font-mono text-xs sm:text-sm text-[var(--foreground-muted)] uppercase tracking-wider mb-4 block">
              Get to know me
            </span>
            <h2 className="display-lg text-[var(--foreground)]">About</h2>
          </div>

          {/* Two column layout */}
          <div
            ref={contentRef}
            className="grid gap-12 lg:grid-cols-2 lg:gap-16"
            style={{ opacity: 0 }}
          >
            {/* Left column - Bio */}
            <div className="space-y-8">
              {/* Image (mobile) */}
              {imageUrl && (
                <div className="lg:hidden aspect-square max-w-xs overflow-hidden rounded-2xl">
                  <img
                    src={imageUrl}
                    alt={name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h3 className="display-sm mb-2">{name}</h3>
                <p className="font-mono text-sm text-[var(--accent-primary)] mb-6">
                  {title}
                </p>
                <p className="body-lg text-[var(--foreground-muted)] leading-relaxed">
                  {bio}
                </p>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href={resumeUrl}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] text-white font-medium rounded-lg hover-lift hover-glow"
                >
                  <svg
                    className="w-5 h-5"
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
                  Download Resume
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[var(--foreground)] font-medium rounded-lg btn-fill"
                >
                  Get in touch
                </a>
              </div>

              {/* Timeline */}
              <div ref={timelineRef} className="pt-8 border-t border-[var(--foreground)]/10">
                <h4 className="font-mono text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-6">
                  Journey
                </h4>
                <div className="space-y-6">
                  {timeline.map((item, index) => (
                    <div
                      key={index}
                      className="timeline-item flex gap-4"
                      style={{ opacity: 0 }}
                    >
                      <div className="flex flex-col items-center">
                        <span className="w-3 h-3 rounded-full bg-[var(--accent-primary)]" />
                        {index < timeline.length - 1 && (
                          <div className="w-px flex-1 bg-[var(--foreground)]/10 mt-2" />
                        )}
                      </div>
                      <div className="pb-6">
                        <span className="font-mono text-xs text-[var(--accent-secondary)]">
                          {item.year}
                        </span>
                        <h5 className="font-semibold text-[var(--foreground)] mt-1">
                          {item.title}
                        </h5>
                        <p className="text-sm text-[var(--foreground-muted)] mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - Image (desktop) */}
            <div className="hidden lg:block">
              {imageUrl ? (
                <div className="sticky top-20 aspect-[4/5] overflow-hidden rounded-2xl">
                  <img
                    src={imageUrl}
                    alt={name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="sticky top-20 aspect-[4/5] bg-gradient-to-br from-[var(--color-lavender)] to-[var(--color-pale-blue)] rounded-2xl flex items-center justify-center">
                  <div className="text-center px-8">
                    <svg
                      className="w-24 h-24 mx-auto mb-4 text-[var(--foreground-muted)]/30"
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
                    <p className="text-sm text-[var(--foreground-muted)]">
                      Photo coming soon
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
