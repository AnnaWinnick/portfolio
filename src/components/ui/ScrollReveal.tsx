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

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.8,
  distance = 40,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!ref.current) return;

    // Skip animations if user prefers reduced motion
    if (prefersReducedMotion) {
      gsap.set(ref.current, { opacity: 1, x: 0, y: 0 });
      return;
    }

    const directionMap = {
      up: { y: distance, x: 0 },
      down: { y: -distance, x: 0 },
      left: { y: 0, x: distance },
      right: { y: 0, x: -distance },
    };

    const { x, y } = directionMap[direction];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        {
          opacity: 0,
          y,
          x,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: once ? "play none none none" : "play reverse play reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, [direction, delay, duration, distance, once, prefersReducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Staggered reveal for lists/grids
interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  childSelector?: string;
  stagger?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function StaggerReveal({
  children,
  className = "",
  childSelector = "> *",
  stagger = 0.1,
  direction = "up",
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!ref.current) return;

    const elements = ref.current.querySelectorAll(childSelector);

    // Skip animations if user prefers reduced motion
    if (prefersReducedMotion) {
      gsap.set(elements, { opacity: 1, x: 0, y: 0 });
      return;
    }

    const directionMap = {
      up: { y: 30, x: 0 },
      down: { y: -30, x: 0 },
      left: { y: 0, x: 30 },
      right: { y: 0, x: -30 },
    };

    const { x, y } = directionMap[direction];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y,
          x,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.6,
          stagger,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, [childSelector, stagger, direction, prefersReducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
