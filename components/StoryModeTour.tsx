"use client";

import React from "react";
import { StoryStep } from "./types";

interface StoryModeTourProps {
  steps: StoryStep[];
  currentStepIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export default function StoryModeTour({
  steps,
  currentStepIndex,
  onNext,
  onPrev,
  onClose,
}: StoryModeTourProps) {
  if (!steps || steps.length === 0) return null;
  const step = steps[currentStepIndex];

  return (
    <div className="absolute top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-30 bg-[#0a0f18]/95 backdrop-blur-md border border-teal-500/40 rounded-xl p-4 shadow-2xl space-y-3 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider">
            Story Mode • Step {currentStepIndex + 1} of {steps.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-xs font-mono px-1.5 py-0.5 rounded hover:bg-slate-800"
          aria-label="Exit Story Tour"
        >
          Exit Tour ✕
        </button>
      </div>

      <div>
        <h4 className="text-sm font-bold text-white mb-1">{step.title}</h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {step.description}
        </p>
      </div>

      {/* Tour Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-teal-400 h-full transition-all duration-300"
          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onPrev}
          disabled={currentStepIndex === 0}
          className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs text-slate-300 font-medium transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          className="px-4 py-1 rounded bg-teal-500 hover:bg-teal-400 text-xs text-slate-950 font-bold transition-colors"
        >
          {currentStepIndex === steps.length - 1 ? "Finish Tour ✓" : "Next Step →"}
        </button>
      </div>
    </div>
  );
}
