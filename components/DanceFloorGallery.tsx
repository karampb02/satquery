"use client";

import React from "react";
import { CatalogItem } from "./types";

interface DanceFloorGalleryProps {
  scenes: CatalogItem[];
  currentSceneId: string;
  onSelectScene: (id: string) => void;
}

export default function DanceFloorGallery({
  scenes,
  currentSceneId,
  onSelectScene,
}: DanceFloorGalleryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {scenes.map((scene) => {
        const isSelected = scene.id === currentSceneId;
        const isFlood = scene.change_type === "flood";
        const isVeg = scene.change_type === "vegetation";

        const badgeColor = isFlood
          ? "bg-cyan-950/80 text-cyan-300 border-cyan-800/60"
          : isVeg
          ? "bg-amber-950/80 text-amber-300 border-amber-800/60"
          : "bg-pink-950/80 text-pink-300 border-pink-800/60";

        const activeBorder = isSelected
          ? "border-teal-400 ring-2 ring-teal-500/30 shadow-xl shadow-teal-950/50"
          : "border-slate-800/90 hover:border-slate-700/90";

        return (
          <div
            key={scene.id}
            onClick={() => {
              onSelectScene(scene.id);
              const el = document.getElementById("viewer");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className={`cursor-pointer rounded-xl bg-[#0a0f18] border ${activeBorder} overflow-hidden transition-all duration-200 hover:-translate-y-1 group flex flex-col`}
          >
            {/* Radar Thumbnail / Preview */}
            <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
              <img
                src={`/data/${scene.id}/after.png`}
                alt={`${scene.title} radar view`}
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-transparent to-transparent opacity-90" />

              {/* Badges on Thumbnail */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span
                  className={`px-2 py-0.5 rounded text-xxs font-mono uppercase tracking-wider font-semibold border ${badgeColor}`}
                >
                  {scene.change_type}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xxs font-mono border ${
                    scene.flag === "real"
                      ? "bg-emerald-950/80 text-emerald-300 border-emerald-700/60"
                      : "bg-slate-900/80 text-amber-300 border-amber-700/60"
                  }`}
                >
                  {scene.flag === "real" ? "VERIFIED SAR" : "SIMULATION"}
                </span>
              </div>

              {/* Peak Metric overlay */}
              <div className="absolute bottom-2 right-3 font-mono text-xs font-bold text-teal-300 bg-slate-900/90 px-2 py-0.5 rounded border border-teal-800/60">
                {scene.peak_metric}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-xxs font-mono text-slate-400 flex items-center gap-1.5 mb-1">
                  <span>📍 {scene.location}</span>
                  <span>•</span>
                  <span>{scene.dates.before} → {scene.dates.after}</span>
                </div>
                <h3 className="font-bold text-base text-slate-100 group-hover:text-teal-400 transition-colors line-clamp-1">
                  {scene.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {scene.headline}
                </p>
              </div>

              {/* Product Attribution Footer */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xxs font-mono text-slate-400">
                <span className="truncate max-w-[200px]" title={scene.source_products[0]}>
                  {scene.source_products[0]}
                </span>
                <span className="text-teal-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  Explore Scene →
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
