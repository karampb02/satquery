"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import RadarMap from "@/components/RadarMap";
import { SceneMeta, CatalogItem } from "@/components/types";

export default function ComparePage() {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [sceneIdA, setSceneIdA] = useState<string>("brahmaputra-flood-2024");
  const [sceneIdB, setSceneIdB] = useState<string>("turkey-earthquake-2023");

  const [metaA, setMetaA] = useState<SceneMeta | null>(null);
  const [metaB, setMetaB] = useState<SceneMeta | null>(null);

  const [layerA, setLayerA] = useState<"before" | "after" | "change">("change");
  const [layerB, setLayerB] = useState<"before" | "after" | "change">("change");

  // Load Catalog
  useEffect(() => {
    fetch("/data/catalog.json")
      .then((r) => r.json())
      .then((data: CatalogItem[]) => {
        setCatalog(data);
      });
  }, []);

  // Load Scene A
  useEffect(() => {
    if (!sceneIdA) return;
    fetch(`/data/${sceneIdA}/meta.json`)
      .then((r) => r.json())
      .then((m) => setMetaA(m));
  }, [sceneIdA]);

  // Load Scene B
  useEffect(() => {
    if (!sceneIdB) return;
    fetch(`/data/${sceneIdB}/meta.json`)
      .then((r) => r.json())
      .then((m) => setMetaB(m));
  }, [sceneIdB]);

  return (
    <div className="flex flex-col min-h-screen bg-[#06090e] text-slate-100">
      {/* Compare Header */}
      <div className="bg-[#0b121e] border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1 bg-slate-900 rounded border border-slate-800"
          >
            ← Back to Explorer
          </Link>
          <h1 className="text-sm font-bold text-white tracking-wide">
            ⚖️ Side-by-Side Dual Scene Comparison Mode
          </h1>
        </div>

        <div className="text-xxs font-mono text-slate-400">
          Compare different SAR change mechanisms across global ecosystems
        </div>
      </div>

      {/* Main Dual Grid */}
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto w-full">
        {/* Panel A */}
        <div className="flex flex-col bg-[#0a0f18] border border-slate-800 rounded-xl overflow-hidden">
          {/* Header A */}
          <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2">
            <div className="flex-1">
              <label className="text-xxs font-mono uppercase text-teal-400 font-bold block mb-1">
                Scene A (Left)
              </label>
              <select
                value={sceneIdA}
                onChange={(e) => setSceneIdA(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white font-medium focus:outline-none focus:border-teal-500"
              >
                {catalog.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    [{sc.change_type.toUpperCase()}] {sc.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 self-end">
              {(["before", "after", "change"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLayerA(l)}
                  className={`px-2 py-1 rounded text-xxs font-mono font-bold capitalize ${
                    layerA === l ? "bg-teal-500 text-slate-950" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Map A */}
          <div className="flex-1 min-h-[420px] relative">
            {metaA && (
              <RadarMap
                scene={metaA}
                activeLayer={layerA}
                activeBasemap="blank"
                opacity={0.9}
                swipePosition={50}
                currentTimeIndex={0}
              />
            )}
          </div>

          {/* Summary A */}
          <div className="p-3 border-t border-slate-800 bg-slate-950 text-xs font-mono text-slate-300">
            <div className="text-teal-400 font-bold">{metaA?.headline}</div>
            <div className="text-xxs text-slate-400 mt-1">
              Sensor: {metaA?.source_products[0]}
            </div>
          </div>
        </div>

        {/* Panel B */}
        <div className="flex flex-col bg-[#0a0f18] border border-slate-800 rounded-xl overflow-hidden">
          {/* Header B */}
          <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2">
            <div className="flex-1">
              <label className="text-xxs font-mono uppercase text-amber-400 font-bold block mb-1">
                Scene B (Right)
              </label>
              <select
                value={sceneIdB}
                onChange={(e) => setSceneIdB(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white font-medium focus:outline-none focus:border-amber-500"
              >
                {catalog.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    [{sc.change_type.toUpperCase()}] {sc.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 self-end">
              {(["before", "after", "change"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLayerB(l)}
                  className={`px-2 py-1 rounded text-xxs font-mono font-bold capitalize ${
                    layerB === l ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Map B */}
          <div className="flex-1 min-h-[420px] relative">
            {metaB && (
              <RadarMap
                scene={metaB}
                activeLayer={layerB}
                activeBasemap="blank"
                opacity={0.9}
                swipePosition={50}
                currentTimeIndex={0}
              />
            )}
          </div>

          {/* Summary B */}
          <div className="p-3 border-t border-slate-800 bg-slate-950 text-xs font-mono text-slate-300">
            <div className="text-amber-400 font-bold">{metaB?.headline}</div>
            <div className="text-xxs text-slate-400 mt-1">
              Sensor: {metaB?.source_products[0]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
