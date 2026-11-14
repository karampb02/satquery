"use client";

import React, { useState, useEffect, useCallback } from "react";
import HeroLanding from "@/components/HeroLanding";
import DanceFloorGallery from "@/components/DanceFloorGallery";
import RadarMap from "@/components/RadarMap";
import StatsPanel from "@/components/StatsPanel";
import HowSarWorks from "@/components/HowSarWorks";
import StoryModeTour from "@/components/StoryModeTour";
import SceneExportModal from "@/components/SceneExportModal";
import { SceneMeta, SceneStats, TimeSeriesPoint, CatalogItem } from "@/components/types";

export default function HomePage() {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [currentSceneId, setCurrentSceneId] = useState<string>("brahmaputra-flood-2024");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const [sceneMeta, setSceneMeta] = useState<SceneMeta | null>(null);
  const [sceneStats, setSceneStats] = useState<SceneStats | null>(null);
  const [timeseries, setTimeseries] = useState<TimeSeriesPoint[]>([]);

  // Viewer Controls State
  const [activeLayer, setActiveLayer] = useState<"before" | "after" | "change" | "swipe">("change");
  const [activeBasemap, setActiveBasemap] = useState<"gibs_true_color" | "gibs_night" | "blank">("blank");
  const [opacity, setOpacity] = useState<number>(0.9);
  const [swipePosition, setSwipePosition] = useState<number>(50);
  const [currentTimeIndex, setCurrentTimeIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Story Mode State
  const [isStoryActive, setIsStoryActive] = useState<boolean>(false);
  const [storyStepIndex, setStoryStepIndex] = useState<number>(0);

  // Export Modal State
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Load Catalog on Mount
  useEffect(() => {
    fetch("/data/catalog.json")
      .then((res) => res.json())
      .then((data: CatalogItem[]) => {
        setCatalog(data);

        // Check if hash matches an existing scene
        if (typeof window !== "undefined" && window.location.hash) {
          const hashId = window.location.hash.replace("#", "").trim();
          const match = data.find((d) => d.id === hashId);
          if (match) {
            setCurrentSceneId(match.id);
          }
        }
      })
      .catch((err) => console.error("Failed to load scene catalog:", err));
  }, []);

  // Hash change listener
  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window !== "undefined" && window.location.hash) {
        const hashId = window.location.hash.replace("#", "").trim();
        if (hashId && hashId !== currentSceneId) {
          setCurrentSceneId(hashId);
        }
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [currentSceneId]);

  // Load Scene Data when currentSceneId changes
  useEffect(() => {
    if (!currentSceneId) return;

    // Reset viewer mode and story mode on scene switch
    setIsStoryActive(false);
    setStoryStepIndex(0);
    setIsPlaying(false);
    setCurrentTimeIndex(0);

    // Update URL hash smoothly with plain hash ONLY: #scene-id
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${currentSceneId}`);
    }

    Promise.all([
      fetch(`/data/${currentSceneId}/meta.json`).then((r) => r.json()),
      fetch(`/data/${currentSceneId}/stats.json`).then((r) => r.json()),
      fetch(`/data/${currentSceneId}/timeseries.json`).then((r) => r.json()),
    ])
      .then(([meta, stats, ts]) => {
        setSceneMeta(meta);
        setSceneStats(stats);
        setTimeseries(ts);
      })
      .catch((err) => console.error("Failed loading scene bundle:", err));
  }, [currentSceneId]);

  // Time Slider Play/Pause Animation
  useEffect(() => {
    if (!isPlaying || timeseries.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTimeIndex((prev) => (prev + 1) % timeseries.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying, timeseries.length]);

  // Filtered Catalog
  const filteredCatalog = catalog.filter((sc) => {
    if (categoryFilter === "all") return true;
    return sc.change_type === categoryFilter;
  });

  const handleNextStoryStep = () => {
    if (!sceneMeta || !sceneMeta.story_steps) return;
    if (storyStepIndex < sceneMeta.story_steps.length - 1) {
      setStoryStepIndex((i) => i + 1);
      setActiveLayer(sceneMeta.story_steps[storyStepIndex + 1].layer);
    } else {
      setIsStoryActive(false);
      setStoryStepIndex(0);
    }
  };

  const handlePrevStoryStep = () => {
    if (!sceneMeta || !sceneMeta.story_steps) return;
    if (storyStepIndex > 0) {
      setStoryStepIndex((i) => i - 1);
      setActiveLayer(sceneMeta.story_steps[storyStepIndex - 1].layer);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Landing Section */}
      <HeroLanding
        scenes={catalog}
        selectedCategory={categoryFilter}
        onSelectCategory={setCategoryFilter}
        onSelectScene={(id) => setCurrentSceneId(id)}
      />

      {/* 2. Interactive Scene Viewer Section */}
      <section
        id="viewer"
        className="py-6 px-3 sm:px-6 max-w-7xl mx-auto w-full space-y-4"
        aria-label="Interactive Radar Scene Viewer"
      >
        {/* Viewer Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-[#0a0f18] border border-slate-800/90 rounded-xl p-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xxs font-mono uppercase bg-teal-950/70 text-teal-300 border border-teal-800/60 px-2 py-0.5 rounded font-semibold">
                {sceneMeta?.change_type_label || "SAR Observation"}
              </span>
              <span className="text-xxs font-mono text-slate-400">
                📍 {sceneMeta?.location}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {sceneMeta?.title || "Loading Radar Scene..."}
            </h2>
          </div>

          {/* Quick Actions (Story Mode, Export, Compare) */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => {
                setIsStoryActive(!isStoryActive);
                setStoryStepIndex(0);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isStoryActive
                  ? "bg-teal-400 text-slate-950 shadow-md shadow-teal-950/50"
                  : "bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700"
              }`}
            >
              <span>📖</span>
              <span>{isStoryActive ? "Exit Tour" : "Story Mode"}</span>
            </button>

            <button
              onClick={() => setIsExportOpen(true)}
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>📥</span>
              <span>Export</span>
            </button>

            <a
              href="/compare"
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>⚖️</span>
              <span>Side-by-Side</span>
            </a>
          </div>
        </div>

        {/* Core Workspace: Map (Left 65%) + Stats & Narrative (Right 35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[650px] sm:h-[720px]">
          {/* Left: Map Container */}
          <div className="lg:col-span-8 h-[420px] lg:h-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative flex flex-col">
            {/* Viewer Controls Toolbar (Basemap, Layers, Swipe) */}
            <div className="z-20 bg-[#090e18]/90 backdrop-blur-md border-b border-slate-800/80 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              {/* Layer Selection */}
              <div className="flex items-center gap-1">
                <span className="text-slate-400 text-xxs mr-1 hidden sm:inline">LAYER:</span>
                {[
                  { id: "change", label: "Change Mask" },
                  { id: "before", label: "Before" },
                  { id: "after", label: "After" },
                  { id: "swipe", label: "Swipe Slider" },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setActiveLayer(l.id as any)}
                    className={`px-2 py-1 rounded text-xxs font-bold transition-all ${
                      activeLayer === l.id
                        ? "bg-teal-500 text-slate-950 shadow"
                        : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              {/* NASA GIBS Basemap Selector */}
              <div className="flex items-center gap-1">
                <span className="text-slate-400 text-xxs mr-1 hidden sm:inline">BASEMAP:</span>
                {[
                  { id: "blank", label: "Radar Dark" },
                  { id: "gibs_true_color", label: "NASA GIBS Color" },
                  { id: "gibs_night", label: "Night Lights" },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setActiveBasemap(b.id as any)}
                    className={`px-2 py-1 rounded text-xxs font-medium transition-all ${
                      activeBasemap === b.id
                        ? "bg-slate-200 text-slate-950 font-bold"
                        : "bg-slate-800/70 text-slate-300 hover:text-white"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Map Canvas */}
            <div className="flex-1 relative">
              {sceneMeta && (
                <RadarMap
                  scene={sceneMeta}
                  activeLayer={activeLayer}
                  activeBasemap={activeBasemap}
                  opacity={opacity}
                  swipePosition={swipePosition}
                  currentTimeIndex={currentTimeIndex}
                  storyStep={
                    isStoryActive && sceneMeta.story_steps
                      ? sceneMeta.story_steps[storyStepIndex]
                      : null
                  }
                />
              )}

              {/* Active Story Mode Tour Card */}
              {isStoryActive && sceneMeta?.story_steps && (
                <StoryModeTour
                  steps={sceneMeta.story_steps}
                  currentStepIndex={storyStepIndex}
                  onNext={handleNextStoryStep}
                  onPrev={handlePrevStoryStep}
                  onClose={() => setIsStoryActive(false)}
                />
              )}
            </div>

            {/* Bottom Map Interactive Slider Controls (Swipe or Time Slider) */}
            <div className="z-20 bg-[#090e18]/95 border-t border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              {activeLayer === "swipe" ? (
                /* Swipe Position Slider */
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-xxs font-mono text-teal-400 whitespace-nowrap">
                    Before: {sceneMeta?.dates.before}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={swipePosition}
                    onChange={(e) => setSwipePosition(Number(e.target.value))}
                    className="w-full accent-teal-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    aria-label="Swipe position slider"
                  />
                  <span className="text-xxs font-mono text-amber-400 whitespace-nowrap">
                    After: {sceneMeta?.dates.after}
                  </span>
                </div>
              ) : (
                /* Multi-temporal Time Slider with Play/Pause */
                <div className="flex-1 flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-7 h-7 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold flex items-center justify-center text-xs shadow-md transition-colors"
                    aria-label={isPlaying ? "Pause timeline" : "Play timeline"}
                  >
                    {isPlaying ? "⏸" : "▶"}
                  </button>

                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between text-xxs font-mono text-slate-400 mb-1">
                      <span>{timeseries[0]?.date}</span>
                      <span className="text-teal-400 font-bold">
                        {timeseries[currentTimeIndex]?.date} ({timeseries[currentTimeIndex]?.label})
                      </span>
                      <span>{timeseries[timeseries.length - 1]?.date}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={Math.max(0, timeseries.length - 1)}
                      value={currentTimeIndex}
                      onChange={(e) => {
                        setIsPlaying(false);
                        setCurrentTimeIndex(Number(e.target.value));
                      }}
                      className="w-full accent-teal-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      aria-label="Temporal time slider"
                    />
                  </div>
                </div>
              )}

              {/* Opacity Control Slider */}
              <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
                <span className="text-xxs font-mono text-slate-400">Opacity:</span>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-16 accent-teal-400 cursor-pointer h-1 bg-slate-800 rounded-lg"
                  aria-label="Layer opacity slider"
                />
                <span className="text-xxs font-mono text-slate-300 w-7 text-right">
                  {Math.round(opacity * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Right: Stats, Narrative & Legend Panel */}
          <div className="lg:col-span-4 h-full bg-[#0a0f18] rounded-xl border border-slate-800 overflow-y-auto">
            {sceneMeta && sceneStats && (
              <StatsPanel
                scene={sceneMeta}
                stats={sceneStats}
                timeseries={timeseries}
              />
            )}
          </div>
        </div>

        {/* Scene Data Provenance Footer Label (Hard Requirement 1 & 3) */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-xxs font-mono text-slate-400">
          <div>
            <strong className="text-slate-300">Exact Products:</strong>{" "}
            {sceneMeta?.source_products.join(" • ")}
          </div>
          <div>
            <strong className="text-slate-300">DAAC Provider:</strong> {sceneMeta?.daac}
          </div>
          <div className="text-teal-400">
            Plain credit: Data: NASA-ISRO NISAR, NASA/JPL OPERA, ASF DAAC, NASA GIBS
          </div>
        </div>
      </section>

      {/* 3. Dance Floor Gallery Section */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase text-teal-400 font-semibold tracking-wider">
            Explore All Observations
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            The Dance Floor Gallery
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Curated NASA radar observations across all three change types: floods, vegetation, and crustal deformation.
          </p>
        </div>

        <DanceFloorGallery
          scenes={filteredCatalog}
          currentSceneId={currentSceneId}
          onSelectScene={(id) => setCurrentSceneId(id)}
        />
      </section>

      {/* 4. How SAR Works Explainer Section */}
      <HowSarWorks />

      {/* 5. Export Modal */}
      {sceneMeta && (
        <SceneExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          scene={sceneMeta}
        />
      )}
    </div>
  );
}
