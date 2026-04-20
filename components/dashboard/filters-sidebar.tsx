"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Grade } from "@/lib/types";
import { getTrackMeta, ROLE_TRACK_OPTIONS } from "@/lib/role-tracks";

const GRADES: Grade[] = ["A+", "A", "B+", "B", "C+"];
const WORK_MODES = ["all", "remote", "hybrid", "onsite"] as const;

export interface FilterState {
  search: string;
  grades: Set<Grade>;
  workMode: string;
  visaOnly: boolean;
  h1bOnly: boolean;
  verifiedH1BOnly: boolean;
}

interface FiltersSidebarProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  totalShowing: number;
  totalAll: number;
  roleTrack: string;
  onTrackChange: (track: string) => void;
  trackSaved?: boolean;
}

export function FiltersSidebar({
  filters,
  onChange,
  totalShowing,
  totalAll,
  roleTrack,
  onTrackChange,
  trackSaved,
}: FiltersSidebarProps) {
  const track = getTrackMeta(roleTrack);

  const toggleGrade = (grade: Grade) => {
    const next = new Set(filters.grades);
    if (next.has(grade)) next.delete(grade);
    else next.add(grade);
    onChange({ ...filters, grades: next });
  };

  const reset = () =>
    onChange({
      search: "",
      grades: new Set(["A+", "A", "B+", "B", "C+"]) as Set<Grade>,
      workMode: "all",
      visaOnly: false,
      h1bOnly: false,
      verifiedH1BOnly: false,
    });

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="glass rounded-2xl p-5 sticky top-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-white font-semibold">
            <SlidersHorizontal className="w-4 h-4 text-violet-400" />
            Filters
          </div>
          <button
            onClick={reset}
            className="text-xs text-slate-500 hover:text-violet-400 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Reset
          </button>
        </div>

        {/* Role track */}
        <div className="mb-5">
          <label className="text-slate-400 text-xs font-medium mb-2 block uppercase tracking-wider">
            Role Track
          </label>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">{track.icon}</span>
            <span className="text-purple-400 text-sm font-medium">{track.label}</span>
          </div>
          <select
            value={roleTrack}
            onChange={(e) => onTrackChange(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
          >
            {ROLE_TRACK_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-slate-900">
                {o.icon} {o.label}
              </option>
            ))}
          </select>
          <p className="text-slate-600 text-xs mt-1">
            {trackSaved
              ? "✓ Track saved — new matches on next pipeline run"
              : "Saved track is used to rank your next job run"}
          </p>
        </div>

        {/* Result count */}
        <p className="text-slate-400 text-xs mb-5">
          Showing <span className="text-white font-semibold">{totalShowing}</span> of{" "}
          <span className="text-white font-semibold">{totalAll}</span> jobs
        </p>

        {/* Search */}
        <div className="mb-5">
          <label className="text-slate-400 text-xs font-medium mb-2 block uppercase tracking-wider">
            Search Company
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="e.g. Google"
              value={filters.search}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              className="pl-9"
            />
          </div>
        </div>

        {/* Grade filter */}
        <div className="mb-5">
          <label className="text-slate-400 text-xs font-medium mb-2 block uppercase tracking-wider">
            Grade Filter
          </label>
          <div className="flex flex-wrap gap-1.5">
            {GRADES.map((g) => (
              <button
                key={g}
                onClick={() => toggleGrade(g)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-semibold border transition-all",
                  filters.grades.has(g)
                    ? "bg-violet-600 border-violet-500 text-white"
                    : "bg-white/5 border-white/10 text-slate-400 hover:border-violet-500/50",
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Work mode */}
        <div className="mb-5">
          <label className="text-slate-400 text-xs font-medium mb-2 block uppercase tracking-wider">
            Work Mode
          </label>
          <div className="flex flex-wrap gap-1.5">
            {WORK_MODES.map((m) => (
              <button
                key={m}
                onClick={() => onChange({ ...filters, workMode: m })}
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-semibold border transition-all capitalize",
                  filters.workMode === m
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-white/5 border-white/10 text-slate-400 hover:border-blue-500/50",
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Visa toggles */}
        <div className="space-y-2">
          <label className="text-slate-400 text-xs font-medium block uppercase tracking-wider">
            Visa Filters
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => onChange({ ...filters, h1bOnly: !filters.h1bOnly })}
              className={cn(
                "w-8 h-4 rounded-full border transition-all relative",
                filters.h1bOnly
                  ? "bg-violet-600 border-violet-500"
                  : "bg-white/10 border-white/20",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all",
                  filters.h1bOnly ? "left-4" : "left-0.5",
                )}
              />
            </div>
            <span className="text-slate-300 text-sm group-hover:text-white transition-colors">
              H1B Sponsors Only
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => onChange({ ...filters, visaOnly: !filters.visaOnly })}
              className={cn(
                "w-8 h-4 rounded-full border transition-all relative",
                filters.visaOnly
                  ? "bg-violet-600 border-violet-500"
                  : "bg-white/10 border-white/20",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all",
                  filters.visaOnly ? "left-4" : "left-0.5",
                )}
              />
            </div>
            <span className="text-slate-300 text-sm group-hover:text-white transition-colors">
              Hide Visa-Flagged
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => onChange({ ...filters, verifiedH1BOnly: !filters.verifiedH1BOnly })}
              className={cn(
                "w-8 h-4 rounded-full border transition-all relative",
                filters.verifiedH1BOnly
                  ? "bg-green-600 border-green-500"
                  : "bg-white/10 border-white/20",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all",
                  filters.verifiedH1BOnly ? "left-4" : "left-0.5",
                )}
              />
            </div>
            <span className="text-slate-300 text-sm group-hover:text-white transition-colors">
              🟢 Verified H1B Sponsors Only
            </span>
          </label>
        </div>
      </div>
    </aside>
  );
}
