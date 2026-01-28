"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Hook to check for reduced motion preference
function usePrefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface HeroProps {
  name?: string;
  role?: string;
  tagline?: string;
  email?: string;
  resumeUrl?: string;
  imageUrl?: string;
}

export function Hero({
  name = "Anna Winnick",
  role = "Creative DevOps Engineer",
  tagline = "Painting, crocheting, and shipping infrastructure with equal enthusiasm.",
  email = "anna@example.com",
  imageUrl,
}: HeroProps) {
  const [visitorName, setVisitorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const shapeRef1 = useRef<HTMLDivElement>(null);
  const shapeRef2 = useRef<HTMLDivElement>(null);
  const shapesContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: visitorName.trim() }),
      });
      setHasSubmitted(true);
    } catch (error) {
      console.error("Failed to log visitor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const prefersReducedMotion = usePrefersReducedMotion();

    // If user prefers reduced motion, set everything to final state immediately
    if (prefersReducedMotion) {
      if (nameRef.current) {
        const letters = nameRef.current.querySelectorAll(".letter");
        gsap.set(letters, { opacity: 1, y: 0 });
      }
      gsap.set([roleRef.current, taglineRef.current, ctaRef.current], { opacity: 1, y: 0 });
      if (photoRef.current) gsap.set(photoRef.current, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Timeline for entrance animations
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Animate photo first (subtle fade in)
      if (photoRef.current) {
        tl.from(photoRef.current, {
          opacity: 0,
          scale: 1.05,
          duration: 1.5,
        });
      }

      // Animate name letters
      if (nameRef.current) {
        const letters = nameRef.current.querySelectorAll(".letter");
        tl.from(letters, {
          y: 120,
          opacity: 0,
          duration: 1.2,
          stagger: 0.04,
        }, "-=1.2");
      }

      // Animate role
      tl.from(
        roleRef.current,
        {
          y: 40,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.6"
      );

      // Animate tagline
      tl.from(
        taglineRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.5"
      );

      // Animate CTAs
      tl.from(
        ctaRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
        },
        "-=0.4"
      );

      // Floating shapes animation
      gsap.to(shapeRef1.current, {
        y: 30,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(shapeRef2.current, {
        y: -20,
        x: 10,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Parallax scroll effect for shapes
      gsap.to(shapesContainerRef.current, {
        y: 100,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    // Mouse parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!shapesContainerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      gsap.to(shapesContainerRef.current, {
        x: xPercent * 30,
        y: yPercent * 20,
        duration: 0.8,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Split name into letters for animation
  const nameLetters = name.split("").map((char, i) => (
    <span
      key={i}
      className="letter inline-block"
      style={{ display: char === " " ? "inline" : "inline-block" }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));

  const scrollToIdeas = () => {
    const ideas = document.querySelector("#ideas");
    ideas?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-[70vh] sm:min-h-[80vh] flex flex-col justify-center relative overflow-hidden py-12 sm:py-16"
    >
      {/* Background photo placeholder */}
      <div
        ref={photoRef}
        className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block pointer-events-none"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-l from-[var(--color-lavender)]/60 via-[var(--color-pale-blue)]/40 to-transparent">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center opacity-30">
                <svg
                  className="w-32 h-32 mx-auto text-[var(--foreground-muted)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={0.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-mono text-xs text-[var(--foreground-muted)] uppercase tracking-wider mt-4 block">
                  Photo placeholder
                </span>
              </div>
            </div>
          </div>
        )}
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/80 to-transparent" />
      </div>

      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, var(--accent-primary) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, var(--accent-secondary) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, var(--color-lavender) 0%, transparent 60%)
          `,
        }}
      />

      {/* Decorative shapes with parallax */}
      <div
        ref={shapesContainerRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <div
          ref={shapeRef1}
          className="absolute top-1/4 right-[10%] w-32 h-32 sm:w-64 sm:h-64 rounded-full opacity-30 blur-xl"
          style={{ background: "var(--color-brink-pink)" }}
        />
        <div
          ref={shapeRef2}
          className="absolute bottom-1/4 left-[5%] w-24 h-24 sm:w-48 sm:h-48 opacity-25 blur-xl"
          style={{ background: "var(--accent-secondary)" }}
        />
        {/* Additional subtle shape */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 rounded-full opacity-10 blur-2xl"
          style={{ background: "var(--color-lavender)" }}
        />
      </div>

      {/* Content */}
      <div className="container-wide relative z-10">
        <div>
          {/* Greeting with name */}
          <div className="mb-8">
            {hasSubmitted ? (
              <h1
                ref={nameRef}
                className="text-4xl sm:text-6xl lg:text-7xl tracking-tight"
                style={{ overflow: "hidden", fontFamily: "var(--font-mono), monospace" }}
              >
                <span className="text-[var(--foreground)]">Hi </span>
                <span className="text-[var(--accent-primary)]">{visitorName}</span>
                <span className="text-[var(--foreground)]">, I&apos;m </span>
                <span className="font-bold text-[var(--accent-secondary)]">{nameLetters}</span>
              </h1>
            ) : (
              <form onSubmit={handleSubmit}>
                <h1
                  ref={nameRef}
                  className="text-4xl sm:text-6xl lg:text-7xl tracking-tight"
                  style={{ overflow: "hidden", fontFamily: "var(--font-mono), monospace" }}
                >
                  <span className="text-[var(--foreground)]">Hi </span>
                  <span className="inline-flex flex-col">
                    <input
                      type="text"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="you"
                      className="hero-name-input bg-transparent border-b-2 border-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)] outline-none w-28 sm:w-40 lg:w-48 text-[var(--accent-primary)]"
                      style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "inherit",
                        lineHeight: "inherit",
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!visitorName.trim() || isSubmitting}
                      className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-[var(--foreground-muted)] hover:text-[var(--accent-primary)] disabled:opacity-50 transition-colors mt-1"
                      style={{ fontFamily: "inherit" }}
                    >
                      <span>tell me you&apos;re here</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </span>
                  <span className="text-[var(--foreground)]">, I&apos;m </span>
                  <span className="font-bold text-[var(--accent-secondary)]">{nameLetters}</span>
                </h1>
              </form>
            )}
          </div>

          {/* Role */}
          <p
            ref={roleRef}
            className="font-mono text-xl sm:text-2xl text-[var(--accent-secondary)] mb-8"
          >
            {role}
          </p>

          {/* Tagline */}
          <p
            ref={taglineRef}
            className="body-lg text-[var(--foreground-muted)] max-w-lg mb-8"
          >
            {tagline}
          </p>

          {/* Tech stack badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            {["Next.js", "TypeScript", "Prisma", "Docker"].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-mono bg-[var(--foreground)]/5 text-[var(--foreground-muted)] rounded-full border border-[var(--foreground)]/10"
              >
                {tech}
              </span>
            ))}
            <span className="px-3 py-1 text-xs font-mono text-[var(--foreground-muted)]/60">
              self-hosted
            </span>
          </div>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <button
              onClick={scrollToIdeas}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-[var(--accent-primary)] text-white text-base sm:text-lg font-medium hover-lift hover-glow rounded-lg"
            >
              Explore my work
            </button>
            <a
              href={`mailto:${email}`}
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-[var(--foreground)] text-base sm:text-lg font-medium btn-fill rounded-lg text-center"
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator - hidden on mobile */}
      <button
        onClick={scrollToIdeas}
        className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
        aria-label="Scroll to content"
      >
        <span className="font-mono text-xs uppercase tracking-wider">Scroll</span>
        <svg
          className="w-6 h-6 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>
    </section>
  );
}
