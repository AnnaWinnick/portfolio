export function Footer() {
  return (
    <footer id="contact" className="bg-[var(--color-deep-teal)]">
      {/* Contact Section */}
      <div className="py-20 border-b border-[var(--foreground-dark)]/10">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="display-md text-[var(--foreground-dark)] mb-6">
              Let&apos;s create together
            </h2>
            <p className="body-lg text-[var(--foreground-dark-muted)] mb-8">
              Have a project in mind or just want to chat? I&apos;d love to hear from you.
            </p>
            <a
              href="mailto:anna@example.com"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--accent-primary)] text-white text-lg font-medium rounded-lg hover-lift hover-glow"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Get in touch
            </a>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="py-12">
        <div className="container-wide">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-2">
              <h3 className="display-sm text-[var(--foreground-dark)] mb-4">
                Anna Winnick
              </h3>
              <p className="body-md text-[var(--foreground-dark-muted)] max-w-md">
                Creative DevOps Engineer blending artistry with infrastructure.
              </p>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h4 className="font-mono text-xs text-[var(--foreground-dark-muted)] uppercase tracking-wider">
                Connect
              </h4>
              <div className="flex gap-4">
                <a
                  href="https://github.com/annawinnick"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--foreground-dark)]/10 text-[var(--foreground-dark)] hover:bg-[var(--accent-primary)] hover:text-white transition-all"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/in/annawinnick"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--foreground-dark)]/10 text-[var(--foreground-dark)] hover:bg-[var(--accent-primary)] hover:text-white transition-all"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://threescompany.substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--foreground-dark)]/10 text-[var(--foreground-dark)] hover:bg-[var(--accent-primary)] hover:text-white transition-all"
                  aria-label="Substack"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="space-y-4">
              <h4 className="font-mono text-xs text-[var(--foreground-dark-muted)] uppercase tracking-wider">
                Built with
              </h4>
              <div className="flex flex-wrap gap-2">
                {["Next.js", "TypeScript", "Prisma", "Tailwind"].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs font-mono bg-[var(--foreground-dark)]/10 text-[var(--foreground-dark-muted)] rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[var(--foreground-dark-muted)]/60 font-mono">
                Self-hosted with Docker
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="h-px bg-[var(--foreground-dark)]/10 my-8" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-mono text-xs text-[var(--foreground-dark-muted)]/60">
              © {new Date().getFullYear()} Anna Winnick. All rights reserved.
            </p>
            <p className="font-mono text-xs text-[var(--foreground-dark-muted)]/60">
              Made with ♥ in Seattle
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
