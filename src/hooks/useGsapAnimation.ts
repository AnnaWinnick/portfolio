"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Parallax effect hook
export function useParallax<T extends HTMLElement>(
  yOffset: number = 100,
  speed: number = 1
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: yOffset * speed,
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
  }, [yOffset, speed]);

  return ref;
}

// Fade-in on scroll hook
export function useFadeIn<T extends HTMLElement>(
  direction: "up" | "down" | "left" | "right" = "up",
  delay: number = 0
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const directionMap = {
      up: { y: 60, x: 0 },
      down: { y: -60, x: 0 },
      left: { x: 60, y: 0 },
      right: { x: -60, y: 0 },
    };

    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        ...directionMap[direction],
        opacity: 0,
        duration: 1,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, [direction, delay]);

  return ref;
}

// Staggered children animation hook
export function useStaggerFadeIn<T extends HTMLElement>(
  stagger: number = 0.1,
  direction: "up" | "down" | "left" | "right" = "up"
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const directionMap = {
      up: { y: 40, x: 0 },
      down: { y: -40, x: 0 },
      left: { x: 40, y: 0 },
      right: { x: -40, y: 0 },
    };

    const children = ref.current.children;
    if (children.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(children, {
        ...directionMap[direction],
        opacity: 0,
        duration: 0.8,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, [stagger, direction]);

  return ref;
}

// Scale-in animation hook
export function useScaleIn<T extends HTMLElement>(delay: number = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, [delay]);

  return ref;
}
