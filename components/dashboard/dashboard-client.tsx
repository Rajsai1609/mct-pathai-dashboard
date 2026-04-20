"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { StatsCards } from "./stats-cards";
import { JobCard } from "./job-card";
import { FiltersSidebar, type FilterState } from "./filters-sidebar";
import { ApplicationsBoard } from "./applications-board";
import type { JobMatch, Grade, JobApplication, ApplicationStatus } from "@/lib/types";
import { updateStudentTracks, upsertApplication, removeApplication } from "@/lib/supabase";

interface DashboardClientProps {
  jobs: JobMatch[];
  studentName: string;
  studentId: string;
  roleTracks: string[];
  initialApplications: JobApplication[];
}

const DEFAULT_FILTERS: FilterState = {
  search: "",
  grades: new Set(["A+", "A", "B+", "B", "C+"]) as Set<Grade>,
  workMode: "all",
  visaOnly: false,
  h1bOnly: false,
  verifiedH1BOnly: false,
};

type Tab = "jobs" | "board";

export function DashboardClient({
  jobs,
  studentName,
  studentId,
  roleTracks,
  initialApplications,
}: DashboardClientProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [currentTracks, setCurrentTracks] = useState<string[]>(roleTracks);
  const [trackSaved, setTrackSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("jobs");

  const [applications, setApplications] = useState<Map<string, ApplicationStatus>>(
    () => new Map(initialApplications.map((a) => [a.job_id, a.status])),
  );

  const handleTracksChange = async (newTracks: string[]) => {
    setCurrentTracks(newTracks);
    setTrackSaved(false);
    await updateStudentTracks(studentId, newTracks);
    setTrackSaved(true);
    router.refresh();
  };

  const handleStatusChange = async (jobId: string, status: ApplicationStatus | null) => {
    if (status === null) {
      setApplications((prev) => {
        const next = new Map(prev);
        next.delete(jobId);
        return next;
      });
      await removeApplication(studentId, jobId);
    } else {
      setApplications((prev) => new Map(prev).set(jobId, status));
      await upsertApplication(studentId, jobId, status);
    }
  };

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

  const trackedCount = applications.size;

  return (
    <div className="space-y-8">
      <StatsCards stats={stats} />

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/10 pb-0">
        <button
          onClick={() => setActiveTab("jobs")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
            activeTab === "jobs"
              ? "border-violet-500 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          All Jobs
          <span className="ml-2 text-xs text-slate-500">{jobs.length}</span>
        </button>
        <button
          onClick={() => setActiveTab("board")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
            activeTab === "board"
              ? "border-violet-500 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          My Board
          {trackedCount > 0 && (
            <span className="ml-2 text-xs bg-violet-600 text-white rounded-full px-1.5 py-0.5">
              {trackedCount}
            </span>
          )}
        </button>
      </div>

      {activeTab === "board" ? (
        <ApplicationsBoard
          jobs={jobs}
          applications={applications}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <FiltersSidebar
            filters={filters}
            onChange={setFilters}
            totalShowing={filtered.length}
            totalAll={jobs.length}
            roleTracks={currentTracks}
            onTracksChange={handleTracksChange}
            trackSaved={trackSaved}
          />

          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center text-slate-400">
                No jobs match the current filters.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    status={applications.get(job.id) ?? null}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
