"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Hook to check for reduced motion preference
function usePrefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  speed?: number; // negative = slower than scroll, positive = faster
  direction?: "vertical" | "horizontal";
}

export function ParallaxLayer({
  children,
  className = "",
  speed = 0.5,
  direction = "vertical",
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!ref.current) return;

    // Skip parallax if user prefers reduced motion
    if (prefersReducedMotion) return;

    const movement = 100 * speed;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        [direction === "vertical" ? "y" : "x"]: movement,
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
  }, [speed, direction, prefersReducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Mouse parallax for hero sections
interface MouseParallaxProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function MouseParallax({
  children,
  className = "",
  strength = 20,
}: MouseParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!ref.current) return;

    // Skip mouse parallax if user prefers reduced motion
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      gsap.to(ref.current, {
        x: xPercent * strength,
        y: yPercent * strength,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [strength, prefersReducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
