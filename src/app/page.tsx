import { Hero } from "@/components/sections/Hero";
import { Toolbox } from "@/components/sections/Toolbox";
import { Ideas } from "@/components/sections/Ideas";
import { Skills } from "@/components/sections/Skills";
import { HobbiesGallery } from "@/components/sections/HobbiesGallery";
import { Bookshelf } from "@/components/sections/Bookshelf";
import { About } from "@/components/sections/About";
import { SubstackPosts } from "@/components/sections/SubstackPosts";
import { TerminalSidebar } from "@/components/sections/TerminalSidebar";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main id="main-content">
      {/* Hero - Full screen with animations */}
      <Hero />

      {/* Ideas - Pale Blue background (per spec) */}
      <section id="ideas" className="section-accent-pale-blue">
        <Ideas />
      </section>

      {/* Skills - Lavender background (per spec) */}
      <section id="skills" className="section-accent-lavender">
        <Skills />
      </section>

      {/* Hobbies Gallery - Horizontal scroll */}
      <HobbiesGallery />

      {/* Toolbox & Writing - Brink Pink accent */}
      <section className="py-20" style={{ background: "var(--color-brink-pink)" }}>
        <div className="container-wide">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.5fr]">
            <Toolbox />
            <SubstackPosts />
          </div>
        </div>
      </section>

      {/* Bookshelf - Night Forest with parallax */}
      <section id="bookshelf" className="section-dark">
        <Bookshelf />
      </section>

      {/* About - Lavender background */}
      <section id="about" className="section-accent-lavender">
        <About />
      </section>

      {/* Terminal/Spotify Widget */}
      <section className="py-20">
        <div className="container-wide">
          <div className="max-w-md ml-auto">
            <TerminalSidebar />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
