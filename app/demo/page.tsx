"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import RadarMap from "@/components/RadarMap";
import StatsPanel from "@/components/StatsPanel";
import { SceneMeta, SceneStats, TimeSeriesPoint } from "@/components/types";

export default function DemoPage() {
  const [seconds, setSeconds] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const [sceneMeta, setSceneMeta] = useState<SceneMeta | null>(null);
  const [sceneStats, setSceneStats] = useState<SceneStats | null>(null);
  const [timeseries, setTimeseries] = useState<TimeSeriesPoint[]>([]);

  // Demo dynamic properties
  const [activeLayer, setActiveLayer] = useState<"before" | "after" | "change" | "swipe">("before");
  const [swipePos, setSwipePos] = useState<number>(50);
  const [timeIndex, setTimeIndex] = useState<number>(0);
  const [activeStepText, setActiveStepText] = useState<string>("Initializing 30-Second Radar Demonstration...");

  // Load demo scene (Brahmaputra Flood)
  useEffect(() => {
    Promise.all([
      fetch("/data/brahmaputra-flood-2024/meta.json").then((r) => r.json()),
      fetch("/data/brahmaputra-flood-2024/stats.json").then((r) => r.json()),
      fetch("/data/brahmaputra-flood-2024/timeseries.json").then((r) => r.json()),
    ]).then(([m, s, t]) => {
      setSceneMeta(m);
      setSceneStats(s);
      setTimeseries(t);
    });
  }, []);

  // 30-second auto-play timer loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev >= 30) {
          return 0; // loop back or stay
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Choreograph stages across the 30 seconds
  useEffect(() => {
    if (seconds >= 0 && seconds < 6) {
      // Stage 1: Pre-event Baseline
      setActiveLayer("before");
      setActiveStepText("Stage 1/5: Pre-monsoon Baseline SAR Image (June 2024) under heavy cloud cover.");
    } else if (seconds >= 6 && seconds < 12) {
      // Stage 2: Post-event Flood
      setActiveLayer("after");
      setActiveStepText("Stage 2/5: Extreme Monsoon Inundation (July 2024) penetrating clouds 24/7.");
    } else if (seconds >= 12 && seconds < 19) {
      // Stage 3: Interactive Swipe Action
      setActiveLayer("swipe");
      const oscillation = 50 + 35 * Math.sin((seconds - 12) * 1.2);
      setSwipePos(Math.round(oscillation));
      setActiveStepText("Stage 3/5: Dynamic Before/After Radar Swipe Reveal showing swollen river corridors.");
    } else if (seconds >= 19 && seconds < 25) {
      // Stage 4: Multi-temporal Time Slider
      setActiveLayer("change");
      const idx = Math.floor(((seconds - 19) / 6) * (timeseries.length || 6));
      setTimeIndex(Math.min(idx, timeseries.length - 1));
      setActiveStepText("Stage 4/5: Temporal Scrubbing across 6 satellite passes tracking flood cresting.");
    } else {
      // Stage 5: Stats & Detection Polygons
      setActiveLayer("change");
      setActiveStepText("Stage 5/5: Vector Inundation Polygons (412.4 km²) + Specular reflection analytics.");
    }
  }, [seconds, timeseries.length]);

  return (
    <div className="flex flex-col min-h-screen bg-[#06090e] text-slate-100">
      {/* Top Banner with Demo Timer */}
      <div className="bg-[#0b121e] border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1 bg-slate-900 rounded border border-slate-800"
          >
            ← Exit to Explorer
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <h1 className="text-sm font-bold text-white tracking-wide">
              ⚡ 30-Second Autoplay Screen Recording Tour
            </h1>
          </div>
        </div>

        {/* Timer & Playback Controls */}
        <div className="flex items-center gap-3">
          <div className="font-mono text-xs text-amber-300 bg-amber-950/60 border border-amber-800/60 px-3 py-1 rounded">
            {seconds}s / 30s
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1 rounded bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
          >
            {isPlaying ? "Pause ⏸" : "Play ▶"}
          </button>
          <button
            onClick={() => {
              setSeconds(0);
              setIsPlaying(true);
            }}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
          >
            ↺ Restart
          </button>
        </div>
      </div>

      {/* Progress Timeline bar */}
      <div className="w-full bg-slate-900 h-1.5">
        <div
          className="bg-gradient-to-r from-teal-400 via-cyan-400 to-amber-400 h-full transition-all duration-300"
          style={{ width: `${(seconds / 30) * 100}%` }}
        />
      </div>

      {/* Stage Sub-header */}
      <div className="bg-teal-950/40 border-b border-teal-800/40 px-4 py-2 text-center text-xs font-mono text-teal-300">
        {activeStepText}
      </div>

      {/* Main Split Demo Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Map */}
        <div className="lg:col-span-8 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative min-h-[450px]">
          {sceneMeta && (
            <RadarMap
              scene={sceneMeta}
              activeLayer={activeLayer}
              activeBasemap="blank"
              opacity={0.9}
              swipePosition={swipePos}
              currentTimeIndex={timeIndex}
            />
          )}
        </div>

        {/* Right Stats & Explainer */}
        <div className="lg:col-span-4 bg-[#0a0f18] rounded-xl border border-slate-800 overflow-y-auto max-h-[600px]">
          {sceneMeta && sceneStats && (
            <StatsPanel
              scene={sceneMeta}
              stats={sceneStats}
              timeseries={timeseries}
            />
          )}
        </div>
      </div>
    </div>
  );
}
