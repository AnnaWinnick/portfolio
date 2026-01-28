"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useStickyStack<T extends HTMLElement>(index: number = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: `top ${index * 20}px`,
        end: "bottom top",
        pin: true,
        pinSpacing: false,
      });
    });

    return () => ctx.revert();
  }, [index]);

  return ref;
}
