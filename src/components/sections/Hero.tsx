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
  email?: string;
  imageUrl?: string;
}

export function Hero({
  name = "Anna Winnick",
  email = "anna@example.com",
  imageUrl,
}: HeroProps) {
  const [visitorName, setVisitorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
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
      gsap.set([roleRef.current, ctaRef.current], { opacity: 1, y: 0 });
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

      // Animate description
      tl.from(
        roleRef.current,
        {
          y: 40,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.6"
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

  // Split name into letters for animation, keeping words as atomic units
  const words = name.split(" ");
  const nameLetters = words.map((word, wordIndex) => (
    <span key={wordIndex} style={{ whiteSpace: "nowrap", display: "inline-block" }}>
      {word.split("").map((char, charIndex) => (
        <span
          key={`${wordIndex}-${charIndex}`}
          className="letter inline-block"
        >
          {char}
        </span>
      ))}
      {wordIndex < words.length - 1 && <span className="letter" style={{ display: "inline" }}>{"\u00A0"}</span>}
    </span>
  ));

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
                      className="hero-name-input bg-transparent border-b-2 border-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)]/50 outline-none focus:outline-none focus:ring-0 w-28 sm:w-40 lg:w-48 text-[var(--accent-primary)]"
                      style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "inherit",
                        lineHeight: "inherit",
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!visitorName.trim() || isSubmitting}
                      className="inline-flex items-center gap-1 text-xs sm:text-sm text-[var(--foreground-muted)] hover:text-[var(--accent-primary)] disabled:opacity-50 transition-colors"
                      style={{ fontFamily: "inherit" }}
                    >
                      <span>tell me you&apos;re here</span>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          {/* Description */}
          <p
            ref={roleRef}
            className="text-lg sm:text-xl text-[var(--foreground-muted)] max-w-2xl mb-6"
          >
            A <span className="text-[var(--accent-secondary)] font-medium">Creative Platform Engineer</span> who is{" "}
            <a href="#hobbies" className="text-[var(--foreground)] underline decoration-[var(--accent-primary)]/50 hover:decoration-[var(--accent-primary)] transition-colors">painting</a>,{" "}
            <a href="#hobbies" className="text-[var(--foreground)] underline decoration-[var(--accent-primary)]/50 hover:decoration-[var(--accent-primary)] transition-colors">crocheting</a>, and shipping infrastructure with equal enthusiasm.
          </p>

          {/* Tech stack */}
          <p className="text-sm font-mono text-[var(--foreground-muted)]/70 mb-8">
            Built with Next.js, TypeScript, Prisma. Self-hosted with Docker with help from Claude Code.
          </p>

          {/* CTA */}
          <div ref={ctaRef}>
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--accent-primary)] font-mono text-sm sm:text-base tracking-wide hover-lift hover-glow rounded-lg"
              style={{ color: "white" }}
            >
              Get in touch 💌
            </a>
          </div>
        </div>
      </div>

    </section>
  );
}
