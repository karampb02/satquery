"use client";

import React from "react";

export default function HowSarWorks() {
  const cards = [
    {
      id: "pulse",
      title: "1. The Radar Pulse",
      subtitle: "Active Microwave Transmission",
      description:
        "Unlike optical satellites that need daylight and are blocked by clouds, NISAR transmits its own microwave radar pulses (L-band 24 cm / C-band 5.5 cm) that cut straight through storm clouds, smoke plumes, and night.",
      svg: (
        <svg viewBox="0 0 200 120" className="w-full h-28 text-teal-400" fill="none">
          {/* Satellite */}
          <rect x="20" y="20" width="28" height="18" rx="2" fill="#0f172a" stroke="#14b8a6" strokeWidth="2" />
          <line x1="8" y1="29" x2="20" y2="29" stroke="#14b8a6" strokeWidth="2" />
          <line x1="48" y1="29" x2="60" y2="29" stroke="#14b8a6" strokeWidth="2" />
          <rect x="2" y="24" width="6" height="10" fill="#14b8a6" />
          <rect x="60" y="24" width="6" height="10" fill="#14b8a6" />
          {/* Emitted Wavefronts */}
          <path d="M 45 40 A 25 25 0 0 1 75 60" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M 55 50 A 45 45 0 0 1 110 85" stroke="#14b8a6" strokeWidth="2" />
          <path d="M 65 60 A 65 65 0 0 1 145 110" stroke="#2dd4bf" strokeWidth="2" />
          {/* Cloud Penetration */}
          <path
            d="M 80 45 C 75 40, 60 40, 58 48 C 50 48, 48 58, 55 62 C 60 65, 85 65, 90 60 C 95 55, 90 45, 80 45 Z"
            fill="#334155"
            opacity="0.5"
          />
          <text x="96" y="52" fill="#94a3b8" fontSize="8" fontFamily="monospace">
            Clouds Penetrated
          </text>
          {/* Earth Surface */}
          <line x1="0" y1="115" x2="200" y2="115" stroke="#475569" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: "backscatter",
      title: "2. Surface Backscatter",
      subtitle: "Roughness, Moisture & Reflection",
      description:
        "Smooth open water acts as a mirror, reflecting pulses away (dark, < -18 dB). Forest canopies produce rich volume scattering (bright, -12 dB). Urban buildings bounce waves directly back via double-bounce corner reflection.",
      svg: (
        <svg viewBox="0 0 200 120" className="w-full h-28 text-cyan-400" fill="none">
          {/* Incoming Ray */}
          <line x1="40" y1="20" x2="90" y2="90" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 2" />
          <polygon points="90,90 82,82 88,80" fill="#06b6d4" />
          {/* Specular Bounce off Water */}
          <rect x="20" y="90" width="80" height="25" fill="#0c4a6e" opacity="0.6" />
          <line x1="20" y1="90" x2="100" y2="90" stroke="#0284c7" strokeWidth="2" />
          <line x1="90" y1="90" x2="140" y2="20" stroke="#0284c7" strokeWidth="2" opacity="0.5" />
          <text x="35" y="105" fill="#38bdf8" fontSize="8" fontFamily="monospace">
            Water: Specular (Dark)
          </text>
          {/* Forest Volume Scatter */}
          <rect x="110" y="70" width="85" height="45" fill="#064e3b" opacity="0.4" />
          <circle cx="130" cy="80" r="10" fill="#059669" opacity="0.6" />
          <circle cx="150" cy="75" r="12" fill="#10b981" opacity="0.7" />
          <circle cx="170" cy="82" r="10" fill="#059669" opacity="0.6" />
          <line x1="150" y1="75" x2="110" y2="25" stroke="#34d399" strokeWidth="2" />
          <text x="115" y="110" fill="#6ee7b7" fontSize="8" fontFamily="monospace">
            Canopy: Volume Scatter
          </text>
        </svg>
      ),
    },
    {
      id: "change",
      title: "3. Log-Ratio Change",
      subtitle: "Multi-Temporal Masking (ΔdB)",
      description:
        "By calculating the decibel difference between two satellite overpasses (σ²_after - σ²_before), algorithms pinpoint sudden environmental changes: new standing floodwaters, collapsed forest corridors, and wildfire burn scars.",
      svg: (
        <svg viewBox="0 0 200 120" className="w-full h-28 text-amber-400" fill="none">
          {/* Before Matrix */}
          <rect x="15" y="30" width="45" height="45" rx="3" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
          <rect x="20" y="35" width="35" height="35" fill="#1e293b" />
          <text x="24" y="55" fill="#94a3b8" fontSize="9" fontFamily="monospace">T1: Before</text>

          {/* Minus Operator */}
          <text x="70" y="58" fill="#f59e0b" fontSize="18" fontWeight="bold">-</text>

          {/* After Matrix */}
          <rect x="85" y="30" width="45" height="45" rx="3" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
          <rect x="90" y="35" width="35" height="35" fill="#083344" />
          <circle cx="107" cy="52" r="10" fill="#06b6d4" opacity="0.8" />
          <text x="94" y="90" fill="#94a3b8" fontSize="8" fontFamily="monospace">T2: After</text>

          {/* Equals Operator */}
          <text x="140" y="58" fill="#f59e0b" fontSize="18" fontWeight="bold">=</text>

          {/* Result Change Mask */}
          <rect x="155" y="30" width="35" height="45" rx="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="172" cy="52" r="10" fill="#f59e0b" />
          <text x="157" y="90" fill="#f59e0b" fontSize="8" fontFamily="monospace">ΔdB Mask</text>
        </svg>
      ),
    },
    {
      id: "insar",
      title: "4. InSAR & Coherence",
      subtitle: "Interferometric Phase (Δϕ)",
      description:
        "Radar waves have both amplitude and phase. InSAR compares wave phase differences down to millimeters between orbits. Cyclical rainbow fringes reveal tectonic earthquakes, fault ruptures, volcano inflation, and glacier sliding.",
      svg: (
        <svg viewBox="0 0 200 120" className="w-full h-28 text-pink-400" fill="none">
          {/* Cyclical Interference Fringes */}
          <ellipse cx="100" cy="60" rx="80" ry="40" stroke="#3b82f6" strokeWidth="3" opacity="0.8" />
          <ellipse cx="100" cy="60" rx="60" ry="30" stroke="#10b981" strokeWidth="3" opacity="0.8" />
          <ellipse cx="100" cy="60" rx="40" ry="20" stroke="#f59e0b" strokeWidth="3" opacity="0.8" />
          <ellipse cx="100" cy="60" rx="20" ry="10" stroke="#ec4899" strokeWidth="3" opacity="0.9" />
          {/* Fault Line Rupture */}
          <line x1="25" y1="60" x2="175" y2="60" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="35" y="112" fill="#f43f5e" fontSize="8" fontFamily="monospace">
            λ/2 Fringe = 11.9 cm (L-Band)
          </text>
        </svg>
      ),
    },
  ];

  return (
    <section id="how-sar-works" className="py-12 sm:py-16 px-4 sm:px-6 border-t border-slate-800/80 bg-[#070b12]">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
            Radar Remote Sensing Primer
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            How Synthetic Aperture Radar (SAR) Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Understand how radar satellites capture surface change in 30 seconds: from active microwave pulses to millimeter-scale interferometry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <div
              key={c.id}
              className="bg-[#0b111c] border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2 mb-3 flex items-center justify-center">
                  {c.svg}
                </div>
                <div className="text-xxs font-mono uppercase text-teal-400 font-bold">
                  {c.subtitle}
                </div>
                <h3 className="text-sm font-bold text-slate-100 mt-0.5">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {c.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
