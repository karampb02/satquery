import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Liquid — Interactive NISAR Change Visualization",
  description:
    "Tracking and visualizing dynamic Earth-surface change with NASA-ISRO NISAR and NASA OPERA Synthetic Aperture Radar. NASA Space Apps Challenge 2026.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#06090e] text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 bg-[#0a0f18]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none"
              aria-label="Project Liquid Home"
            >
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-teal-500 to-cyan-700 flex items-center justify-center p-1.5 shadow-lg shadow-teal-950/50 group-hover:scale-105 transition-transform">
                {/* Clean geometric radar beam SVG icon */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  className="w-full h-full text-slate-950"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" opacity="0.3" />
                  <path d="M12 3a9 9 0 0 1 9 9" />
                  <circle cx="12" cy="12" r="4" />
                  <line x1="12" y1="12" x2="19" y2="5" />
                </svg>
              </div>
              <div>
                <span className="font-bold tracking-tight text-lg text-slate-100 group-hover:text-teal-400 transition-colors">
                  Project Liquid
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-mono text-teal-400/80 bg-teal-950/70 border border-teal-800/40 px-1.5 py-0.5 rounded">
                  NISAR SAR
                </span>
              </div>
            </Link>

            {/* Navigation links */}
            <nav className="flex items-center gap-1 sm:gap-4 text-xs sm:text-sm font-medium" aria-label="Main Navigation">
              <Link
                href="/#scenes"
                className="px-2.5 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
              >
                Dance Floor
              </Link>
              <Link
                href="/compare"
                className="px-2.5 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
              >
                Compare
              </Link>
              <Link
                href="/#how-sar-works"
                className="hidden md:inline-block px-2.5 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
              >
                How SAR Works
              </Link>
              <Link
                href="/demo"
                className="px-2.5 py-1.5 rounded-md text-amber-400 hover:text-amber-300 bg-amber-950/40 border border-amber-800/40 transition-colors"
              >
                ⚡ 30s Tour
              </Link>
              <Link
                href="/about"
                className="px-2.5 py-1.5 rounded-md text-teal-400 hover:text-teal-300 bg-teal-950/40 border border-teal-800/40 transition-colors"
              >
                About & Data
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Compliant Footer */}
        <footer className="border-t border-slate-800/80 bg-[#070b12] py-6 px-4 sm:px-6 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left space-y-1">
              <p className="font-medium text-slate-300">
                Data: NASA-ISRO NISAR, NASA/JPL OPERA, ASF DAAC, NASA GIBS
              </p>
              <p className="text-slate-400">
                NASA Space Apps Challenge 2026 — &ldquo;Dancing with the SARs&rdquo;
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
              <span className="text-teal-400/90 bg-teal-950/60 border border-teal-800/50 px-2 py-0.5 rounded">
                Built with AI assistance
              </span>
              <a
                href="https://github.com/karampb02/satquery"
                target="_blank"
                rel="noreferrer"
                className="hover:text-teal-400 transition-colors underline underline-offset-4"
              >
                GitHub Repo
              </a>
              <Link
                href="/about#credits"
                className="hover:text-teal-400 transition-colors underline underline-offset-4"
              >
                Credits &amp; Licenses
              </Link>
              <Link
                href="/about#disclosure"
                className="hover:text-teal-400 transition-colors underline underline-offset-4"
              >
                SI Disclosure
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
