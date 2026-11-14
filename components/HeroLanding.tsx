"use client";

import React from "react";
import Link from "next/link";
import { CatalogItem, ChangeType } from "./types";

interface HeroLandingProps {
  scenes: CatalogItem[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectScene: (id: string) => void;
}

export default function HeroLanding({
  scenes,
  selectedCategory,
  onSelectCategory,
  onSelectScene,
}: HeroLandingProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-[#070b14] via-[#09101d] to-[#06090e] py-12 sm:py-20 px-4 sm:px-6">
      {/* Background Radar Sweeper Animation */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full border border-teal-500/20">
          <div className="absolute inset-0 rounded-full border border-teal-500/10 scale-75" />
          <div className="absolute inset-0 rounded-full border border-teal-500/10 scale-50" />
          <div className="absolute inset-0 rounded-full border border-teal-500/10 scale-25" />
          {/* Sweeper Line */}
          <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-gradient-to-t from-teal-400 to-transparent origin-bottom animate-radar-sweep" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
        {/* Challenge Category Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/70 border border-teal-800/50 text-xs font-mono text-teal-300">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
          NASA Space Apps Challenge 2026 — Dancing with the SARs
        </div>

        {/* Hero Tagline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Earth never stops <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-amber-300 bg-clip-text text-transparent">dancing</span>.
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
          Track and visualize dynamic Earth-surface change through clouds, smoke, and darkness using 
          high-resolution radar backscatter and interferometry from <strong className="text-white font-medium">NASA-ISRO NISAR</strong> and <strong className="text-white font-medium">NASA OPERA</strong>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="#scenes"
            className="px-6 py-3 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-teal-950/60 hover:scale-105 active:scale-95"
          >
            Start Exploring
          </a>
          <Link
            href="/demo"
            className="px-5 py-3 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-amber-600/50 text-amber-300 font-semibold text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span>⚡ Auto 30s Tour</span>
          </Link>
          <a
            href="#how-sar-works"
            className="px-5 py-3 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-medium text-sm transition-colors"
          >
            How SAR Works
          </a>
        </div>

        {/* Global Hotspots Map Preview with Pulsing Points */}
        <div className="pt-8 max-w-4xl mx-auto">
          <div className="bg-[#0b121e]/90 border border-slate-800 rounded-xl p-4 sm:p-6 backdrop-blur-md relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                ACTIVE NISAR &amp; OPERA HOTSPOTS ({scenes.length})
              </div>
              <div className="text-xxs font-mono text-slate-400 hidden sm:block">
                CLICK TO LAUNCH ANY SCENE
              </div>
            </div>

            {/* Stylized World Hotspots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {scenes.slice(0, 6).map((sc) => {
                const isFlood = sc.change_type === "flood";
                const isVeg = sc.change_type === "vegetation";
                const accentBorder = isFlood
                  ? "border-cyan-500/40 hover:border-cyan-400"
                  : isVeg
                  ? "border-amber-500/40 hover:border-amber-400"
                  : "border-pink-500/40 hover:border-pink-400";
                const accentDot = isFlood
                  ? "bg-cyan-400"
                  : isVeg
                  ? "bg-amber-400"
                  : "bg-pink-400";

                return (
                  <button
                    key={sc.id}
                    onClick={() => {
                      onSelectScene(sc.id);
                      const el = document.getElementById("viewer");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`text-left p-3 rounded-lg bg-slate-900/60 border ${accentBorder} hover:bg-slate-800/80 transition-all group`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xxs font-mono text-slate-400 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${accentDot} animate-pulse`} />
                        {sc.location}
                      </span>
                      <span className="text-xxs font-mono text-teal-400 font-semibold">
                        {sc.peak_metric}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-100 group-hover:text-teal-300 transition-colors line-clamp-1">
                      {sc.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Change Type Filter Selector Tabs */}
        <div id="scenes" className="pt-8 flex flex-wrap items-center justify-center gap-2">
          {[
            { id: "all", label: "All Curated Scenes" },
            { id: "flood", label: "Surface Water & Floods" },
            { id: "vegetation", label: "Vegetation & Forest Loss" },
            { id: "deformation", label: "Ground Deformation & InSAR" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? "bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-950/50"
                  : "bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
