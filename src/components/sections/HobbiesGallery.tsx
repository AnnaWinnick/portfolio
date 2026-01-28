import prisma from "@/lib/prisma";
import { HobbiesGalleryClient } from "./HobbiesGalleryClient";

export async function HobbiesGallery() {
  const images = await prisma.hobbyImage.findMany({
    orderBy: { order: "asc" },
  });

  if (images.length === 0) {
    return (
      <section className="py-16 sm:py-20 sm:min-h-screen sm:flex sm:flex-col sm:justify-center">
        <div className="container-wide">
          <div className="max-w-5xl">
            {/* Section header */}
            <div className="mb-10 sm:mb-16">
              <span className="font-mono text-xs sm:text-sm text-[var(--foreground-muted)] uppercase tracking-wider mb-4 block">
                Outside of work
              </span>
              <h2 className="display-lg text-[var(--foreground)]">
                Creative Hobbies
              </h2>
              <p className="body-lg text-[var(--foreground-muted)] mt-4 max-w-2xl">
                Art, photography, and creative projects I pursue in my free time.
              </p>
            </div>

            {/* Empty state */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-[var(--foreground)]/5">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-[var(--foreground-muted)]/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="body-lg text-[var(--foreground-muted)]">
                Gallery coming soon...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return <HobbiesGalleryClient images={images} />;
}
