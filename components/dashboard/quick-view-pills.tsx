"use client";

import { cn } from "@/lib/utils";

export const PILLS = [
  { id: "top10",      label: "🔥 Today's Top 10" },
  { id: "verified",   label: "🟢 Verified H1B" },
  { id: "new_week",   label: "⚡ New This Week" },
  { id: "remote",     label: "🏠 Remote Only" },
  { id: "top_grade",  label: "💰 Top Grade (A+/A)" },
  { id: "faang",      label: "🚀 FAANG + Unicorns" },
  { id: "high_match", label: "⭐ High Match (70%+)" },
] as const;

interface QuickViewPillsProps {
  activePills: Set<string>;
  onToggle: (id: string) => void;
}

export function QuickViewPills({ activePills, onToggle }: QuickViewPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {PILLS.map((pill) => (
        <button
          key={pill.id}
          type="button"
          onClick={() => onToggle(pill.id)}
          className={cn(
            "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
            activePills.has(pill.id)
              ? "bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-500/20"
              : "bg-white/5 border-white/10 text-slate-400 hover:border-violet-500/50 hover:text-slate-200",
          )}
        >
          {pill.label}
        </button>
      ))}
      {activePills.size > 0 && (
        <button
          type="button"
          onClick={() => PILLS.forEach((p) => activePills.has(p.id) && onToggle(p.id))}
          className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all"
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}
