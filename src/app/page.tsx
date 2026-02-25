export const dynamic = "force-dynamic";

import { Hero } from "@/components/sections/Hero";
import { Toolbox } from "@/components/sections/Toolbox";
import { Ideas } from "@/components/sections/Ideas";
import { Skills } from "@/components/sections/Skills";
import { HobbiesGallery } from "@/components/sections/HobbiesGallery";
import { Bookshelf } from "@/components/sections/Bookshelf";
import { SubstackPosts } from "@/components/sections/SubstackPosts";
import { TerminalSidebar } from "@/components/sections/TerminalSidebar";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main id="main-content">
      {/* Hero - Compact intro */}
      <Hero />

      {/* Quick Nav - Jump links */}
      <nav className="py-4 border-b border-[var(--foreground)]/10 sticky top-0 bg-[var(--background)]/95 backdrop-blur-sm z-40">
        <div className="container-wide">
          <ul className="flex flex-wrap gap-4 sm:gap-8 justify-center text-sm font-medium">
            <li><a href="#ideas" className="hover:text-[var(--accent-primary)] transition-colors">Ideas</a></li>
            <li><a href="#skills" className="hover:text-[var(--accent-primary)] transition-colors">Skills</a></li>
            <li><a href="#toolbox" className="hover:text-[var(--accent-primary)] transition-colors">Toolbox</a></li>
            <li><a href="#bookshelf" className="hover:text-[var(--accent-primary)] transition-colors">Reading</a></li>
            <li><a href="#hobbies" className="hover:text-[var(--accent-primary)] transition-colors">Hobbies</a></li>
            <li><a href="#contact" className="hover:text-[var(--accent-primary)] transition-colors">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Ideas + Skills side by side */}
      <section className="py-12 sm:py-16">
        <div className="container-wide">
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-2">
            <div id="ideas">
              <Ideas />
            </div>
            <div id="skills">
              <Skills />
            </div>
          </div>
        </div>
      </section>

      {/* Toolbox, Writing & Activity */}
      <section id="toolbox" className="py-12 sm:py-16" style={{ background: "var(--color-brink-pink)" }}>
        <div className="container-wide">
          <div className="grid gap-8 lg:gap-10 lg:grid-cols-3">
            <Toolbox />
            <SubstackPosts />
            <TerminalSidebar />
          </div>
        </div>
      </section>

      {/* Bookshelf - Dark section */}
      <section id="bookshelf" className="section-dark">
        <Bookshelf />
      </section>

      {/* Hobbies Gallery - Horizontal scroll */}
      <section id="hobbies" className="section-accent-lavender">
        <HobbiesGallery />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
