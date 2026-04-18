"use client";

import { useState, useMemo } from "react";
import { StatsCards } from "./stats-cards";
import { JobCard } from "./job-card";
import { FiltersSidebar, type FilterState } from "./filters-sidebar";
import type { JobMatch, Grade } from "@/lib/types";

interface DashboardClientProps {
  jobs: JobMatch[];
  studentName: string;
}

const DEFAULT_FILTERS: FilterState = {
  search: "",
  grades: new Set(["A+", "A", "B+", "B"]) as Set<Grade>,
  workMode: "all",
  visaOnly: false,
  h1bOnly: false,
  verifiedH1BOnly: false,
};

export function DashboardClient({ jobs, studentName }: DashboardClientProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      if (filters.grades.size > 0 && !filters.grades.has(job.grade)) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !job.company.toLowerCase().includes(q) &&
          !job.title.toLowerCase().includes(q)
        )
          return false;
      }
      if (filters.workMode !== "all" && job.work_mode !== filters.workMode) return false;
      if (filters.visaOnly && job.visa_flag) return false;
      if (filters.h1bOnly && job.h1b_sponsor !== true) return false;
      if (filters.verifiedH1BOnly && (job.visa_score ?? 0) < 70) return false;
      return true;
    });
  }, [jobs, filters]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      totalMatched: jobs.length,
      topScore: jobs.length > 0 ? jobs[0].fit_pct : 0,
      topGradeCount: jobs.filter((j) => j.grade === "A+" || j.grade === "A").length,
      newJobsToday: jobs.filter((j) => j.date_posted?.startsWith(today)).length,
    };
  }, [jobs]);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <StatsCards stats={stats} />

      {/* H1B verification info banner */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span>🟢</span>
          <h3 className="text-white font-semibold">How We Verify H1B Sponsors</h3>
        </div>
        <p className="text-gray-400 text-sm">
          Every job listing is cross-referenced with{" "}
          <strong className="text-white">24,329 verified H1B employers</strong>{" "}
          from the US Department of Labor database. No guessing. No assumptions. Real government data.
        </p>
        <div className="flex flex-wrap gap-4 mt-3 text-xs">
          <span className="text-green-400">🟢 Verified — Filed H1Bs with DOL</span>
          <span className="text-yellow-400">🟡 Rarely — Limited H1B history</span>
          <span className="text-red-400">🔴 None — No H1B filings found</span>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters */}
        <FiltersSidebar
          filters={filters}
          onChange={setFilters}
          totalShowing={filtered.length}
          totalAll={jobs.length}
        />

        {/* Job grid */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center text-slate-400">
              No jobs match the current filters.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
