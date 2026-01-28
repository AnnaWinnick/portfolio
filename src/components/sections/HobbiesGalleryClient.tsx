"use client";

import { useRef, useEffect, useState } from "react";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HobbyImage {
  id: string;
  url: string;
  caption: string | null;
  order: number;
}

interface HobbiesGalleryClientProps {
  images: HobbyImage[];
}

export function HobbiesGalleryClient({ images }: HobbiesGalleryClientProps) {
  const { containerRef, wrapperRef } = useHorizontalScroll<HTMLDivElement>();
  const titleRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<HobbyImage | null>(null);

  useEffect(() => {
    if (!titleRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, [containerRef]);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <section ref={containerRef} className="h-screen relative overflow-hidden">
        {/* Section title - fixed position */}
        <div ref={titleRef} className="absolute top-8 left-0 z-10 container-wide" style={{ opacity: 0 }}>
          <span className="font-mono text-xs sm:text-sm text-[var(--foreground-muted)] uppercase tracking-wider mb-2 block">
            Outside of work
          </span>
          <h2 className="display-md sm:display-lg">Creative Hobbies</h2>
          <p className="body-md text-[var(--foreground-muted)] mt-2 max-w-lg hidden sm:block">
            Art, photography, and creative projects I pursue in my free time.
          </p>
        </div>

        {/* Horizontal scroll wrapper */}
        <div
          ref={wrapperRef}
          className="flex items-center h-full gap-6 sm:gap-8 pt-32 sm:pt-40 pb-8"
          style={{
            width: `${images.length * 70 + 30}vw`,
            paddingLeft: "var(--grid-gutter)",
            paddingRight: "var(--grid-gutter)",
          }}
        >
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className="flex-shrink-0 relative group cursor-zoom-in focus:outline-none focus:ring-4 focus:ring-[var(--accent-primary)]/50 rounded-xl overflow-hidden"
              style={{
                width: "clamp(280px, 55vw, 700px)",
                height: "clamp(200px, 65vh, 500px)",
              }}
            >
              <img
                src={img.url}
                alt={img.caption || "Creative hobby"}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="font-mono text-xs text-white/60 mb-2 block">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {img.caption && (
                    <p className="text-white text-lg sm:text-xl font-medium">
                      {img.caption}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-2 mt-3 text-sm text-white/80">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    Click to enlarge
                  </span>
                </div>
              </div>
              {/* Index number */}
              <span className="absolute top-4 right-4 font-mono text-4xl sm:text-6xl text-white/20 pointer-events-none group-hover:text-white/40 transition-colors">
                {String(i + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 hidden sm:flex items-center gap-2 text-[var(--foreground-muted)]">
          <span className="font-mono text-xs uppercase tracking-wider">Scroll</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="animate-pulse"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors p-2"
            onClick={() => setSelectedImage(null)}
            aria-label="Close"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="max-w-[90vw] max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.caption || "Creative hobby"}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            {selectedImage.caption && (
              <p className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-lg font-medium rounded-b-lg">
                {selectedImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
