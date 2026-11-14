"use client";

import React from "react";
import { SceneMeta, SceneStats, TimeSeriesPoint } from "./types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface StatsPanelProps {
  scene: SceneMeta;
  stats: SceneStats;
  timeseries: TimeSeriesPoint[];
}

export default function StatsPanel({
  scene,
  stats,
  timeseries,
}: StatsPanelProps) {
  const isFlood = scene.change_type === "flood";
  const isVeg = scene.change_type === "vegetation";
  const isDeform = scene.change_type === "deformation";

  const accentColor = isFlood
    ? "#06b6d4" // Cyan
    : isVeg
    ? "#f59e0b" // Amber
    : "#ec4899"; // Pink/Rose

  return (
    <div className="flex flex-col gap-4 p-4 text-slate-200">
      {/* Headline Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: accentColor }}
          />
          <span className="text-xs uppercase tracking-wider font-mono font-semibold text-slate-400">
            {scene.change_type_label}
          </span>
        </div>
        <p className="text-sm font-medium text-slate-100 leading-snug">
          {stats.headline || scene.headline}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
          <div className="text-xs text-slate-400 font-mono">Area Affected</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-100 mt-1">
            {stats.area_changed_km2.toLocaleString()}
            <span className="text-xs font-normal text-slate-400 ml-1">km²</span>
          </div>
          <div className="text-xxs text-slate-400 mt-0.5">
            {isFlood ? "Inundated land" : isVeg ? "Disturbed canopy" : "Deformed area"}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
          <div className="text-xs text-slate-400 font-mono">Change Magnitude</div>
          <div
            className="text-xl sm:text-2xl font-bold font-mono mt-1"
            style={{ color: accentColor }}
          >
            {stats.pct_change > 0 ? `+${stats.pct_change}%` : `${stats.pct_change}%`}
          </div>
          <div className="text-xxs text-slate-400 mt-0.5">
            {stats.peak_metric}
          </div>
        </div>
      </div>

      {/* Recharts Multi-temporal Time Series */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-medium text-slate-300">
            SAR Temporal Evolution
          </span>
          <span className="text-xxs font-mono text-slate-400">
            Unit: {stats.unit}
          </span>
        </div>

        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={timeseries}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={accentColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={accentColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                tickFormatter={(val) => val.slice(5)}
              />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "#94a3b8", fontWeight: "bold" }}
                itemStyle={{ color: accentColor }}
                formatter={(value: any, name: any, item: any) => [
                  `${value} ${stats.unit} (${item.payload.label})`,
                  "Observed",
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={accentColor}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend & Colorbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
        <div className="font-mono text-slate-300 text-xxs uppercase tracking-wider font-bold">
          Radar Legend &amp; Colorbar
        </div>

        {isFlood && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xxs font-mono text-slate-400">
              <span>-30 dB (Open Water)</span>
              <span>-15 dB</span>
              <span>0 dB (Rough Land)</span>
            </div>
            <div className="h-2.5 w-full rounded-sm bg-gradient-to-r from-[#020617] via-[#083344] to-[#14b8a6]" />
            <div className="flex items-center gap-2 pt-1">
              <span className="w-3 h-3 rounded-sm bg-[#06b6d4]/60 border border-[#06b6d4]" />
              <span className="text-slate-300">Detected Inundation Polygon (OPERA DSWx)</span>
            </div>
          </div>
        )}

        {isVeg && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xxs font-mono text-slate-400">
              <span>-22 dB (Cleared/Burned)</span>
              <span>-16 dB</span>
              <span>-10 dB (Intact Canopy)</span>
            </div>
            <div className="h-2.5 w-full rounded-sm bg-gradient-to-r from-[#1c1917] via-[#78350f] to-[#10b981]" />
            <div className="flex items-center gap-2 pt-1">
              <span className="w-3 h-3 rounded-sm bg-[#f59e0b]/60 border border-[#f59e0b]" />
              <span className="text-slate-300">OPERA DIST Vegetation Disturbance Alert</span>
            </div>
          </div>
        )}

        {isDeform && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xxs font-mono text-slate-400">
              <span>-50 cm (Away from Sat)</span>
              <span>0 cm</span>
              <span>+50 cm (Toward Sat)</span>
            </div>
            <div className="h-2.5 w-full rounded-sm bg-gradient-to-r from-[#3b82f6] via-[#e2e8f0] to-[#ec4899]" />
            <div className="flex items-center gap-2 pt-1">
              <span className="w-3 h-3 rounded-sm bg-[#ec4899]/60 border border-[#ec4899]" />
              <span className="text-slate-300">InSAR Phase Displacement Fringe Slip</span>
            </div>
          </div>
        )}
      </div>

      {/* Plain Language "What Am I Looking At?" Explainer */}
      <div className="bg-slate-900/90 border border-teal-900/40 rounded-lg p-3.5 space-y-2">
        <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          What Am I Looking At?
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {scene.story}
        </p>

        {/* Cloud Penetration Explainer Sentence */}
        <div className="bg-teal-950/40 border border-teal-800/40 rounded p-2 text-xxs text-teal-200/90 font-mono leading-normal">
          <strong>Radar Physics:</strong> {scene.why_sar}
        </div>
      </div>
    </div>
  );
}
