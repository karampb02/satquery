"use client";

import React, { useState } from "react";
import { SceneMeta } from "./types";

interface SceneExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scene: SceneMeta;
}

export default function SceneExportModal({
  isOpen,
  onClose,
  scene,
}: SceneExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Plain hash link ONLY: #scene-id
  const shareableUrl = typeof window !== "undefined"
    ? `${window.location.origin}/#${scene.id}`
    : `#${scene.id}`;

  const copyUrl = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadGeoJSON = () => {
    const link = document.createElement("a");
    link.href = `/data/${scene.id}/change.geojson`;
    link.download = `${scene.id}-change.geojson`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSnapshot = () => {
    const link = document.createElement("a");
    link.href = `/data/${scene.id}/after.png`;
    link.download = `${scene.id}-sar-composite.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Export Scene Data"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-[#0b121e] border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            Export &amp; Share SAR Scene
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md text-sm font-bold"
            aria-label="Close export dialog"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* GeoJSON Download */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-3.5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-200">
                Vector Change Polygons
              </div>
              <div className="text-xxs font-mono text-slate-400">
                Standard GeoJSON (.geojson) format with area_km2 metrics
              </div>
            </div>
            <button
              onClick={handleDownloadGeoJSON}
              className="px-3 py-1.5 rounded-md bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Download
            </button>
          </div>

          {/* PNG Snapshot Download */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-3.5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-200">
                SAR Composite Snapshot
              </div>
              <div className="text-xxs font-mono text-slate-400">
                Georeferenced radar backscatter image (.png)
              </div>
            </div>
            <button
              onClick={handleDownloadSnapshot}
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
            >
              Download
            </button>
          </div>

          {/* Shareable URL (strictly plain hash #scene-id) */}
          <div className="space-y-1.5">
            <label className="text-xxs font-mono uppercase text-slate-400 font-semibold">
              Shareable Direct Link (Plain Hash)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-xs font-mono text-teal-300 focus:outline-none select-all"
              />
              <button
                onClick={copyUrl}
                className="px-3 py-1.5 rounded-md bg-teal-950 hover:bg-teal-900 border border-teal-800/60 text-teal-300 font-mono text-xs font-semibold whitespace-nowrap transition-colors"
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2 text-xxs font-mono text-slate-400 border-t border-slate-800/80">
          Source Data: {scene.source_products.join(", ")} via {scene.daac}
        </div>
      </div>
    </div>
  );
}
