"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { StatsCards } from "./stats-cards";
import { JobCard } from "./job-card";
import { FiltersSidebar, type FilterState } from "./filters-sidebar";
import { ApplicationsBoard } from "./applications-board";
import { AlumniTab } from "./alumni-tab";
import type { JobMatch, Grade, JobApplication, ApplicationStatus, Alumni } from "@/lib/types";
import { updateStudentTracks, upsertApplication, removeApplication, fetchAllAlumni } from "@/lib/supabase";

interface DashboardClientProps {
  jobs: JobMatch[];
  studentName: string;
  studentId: string;
  studentUniversity?: string;
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

type Tab = "jobs" | "h1b_verified" | "rarely_sponsors" | "saved" | "board" | "alumni";

export function DashboardClient({
  jobs,
  studentName,
  studentId,
  studentUniversity,
  roleTracks,
  initialApplications,
}: DashboardClientProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [currentTracks, setCurrentTracks] = useState<string[]>(roleTracks);
  const [trackSaved, setTrackSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("jobs");
  const [alumni, setAlumni] = useState<Alumni[] | null>(null);
  const alumniRef = useRef(false);

  const [applications, setApplications] = useState<Map<string, ApplicationStatus>>(
    () => new Map(initialApplications.map((a) => [a.job_id, a.status])),
  );

  const handleTabChange = async (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "alumni" && !alumniRef.current) {
      alumniRef.current = true;
      const data = await fetchAllAlumni(studentUniversity);
      setAlumni(data);
    }
  };

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

  const verifiedH1BCount = useMemo(
    () => jobs.filter((j) => (j.visa_score ?? 0) >= 70).length,
    [jobs],
  );
  const rarelySponsorCount = useMemo(
    () => jobs.filter((j) => { const s = j.visa_score ?? 0; return s >= 30 && s < 70; }).length,
    [jobs],
  );

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      // Tab-level H1B pre-filter
      if (activeTab === "h1b_verified" && (job.visa_score ?? 0) < 70) return false;
      if (activeTab === "rarely_sponsors") {
        const s = job.visa_score ?? 0;
        if (s < 30 || s >= 70) return false;
      }
      // Sidebar filters
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
  }, [jobs, filters, activeTab]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      totalMatched: jobs.length,
      topScore: jobs.length > 0 ? jobs[0].fit_pct : 0,
      topGradeCount: jobs.filter((j) => j.grade === "A+" || j.grade === "A").length,
      newJobsToday: jobs.filter((j) => j.date_posted?.startsWith(today)).length,
    };
  }, [jobs]);

  const savedJobs = useMemo(
    () => jobs.filter((j) => applications.has(j.id)),
    [jobs, applications],
  );

  const pipelineStats = useMemo(() => {
    const entries = [...applications.values()];
    return {
      saved:     entries.filter((s) => s === "saved").length,
      applied:   entries.filter((s) => s === "applied").length,
      interview: entries.filter((s) => s === "interview").length,
      offer:     entries.filter((s) => s === "offer").length,
    };
  }, [applications]);

  return (
    <div className="space-y-8">
      <StatsCards stats={stats} />

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/10 pb-0 flex-wrap">
        <button
          onClick={() => handleTabChange("jobs")}
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
          onClick={() => handleTabChange("h1b_verified")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
            activeTab === "h1b_verified"
              ? "border-green-500 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          🟢 Verified H1B
          <span className="ml-2 text-xs text-slate-500">{verifiedH1BCount}</span>
        </button>
        <button
          onClick={() => handleTabChange("rarely_sponsors")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
            activeTab === "rarely_sponsors"
              ? "border-yellow-500 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          🟡 Rarely Sponsors
          <span className="ml-2 text-xs text-slate-500">{rarelySponsorCount}</span>
        </button>
        <button
          onClick={() => handleTabChange("saved")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
            activeTab === "saved"
              ? "border-violet-500 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          ⭐ My Saved
          {savedJobs.length > 0 && (
            <span className="ml-2 text-xs bg-yellow-600 text-white rounded-full px-1.5 py-0.5">
              {savedJobs.length}
            </span>
          )}
        </button>
        <button
          onClick={() => handleTabChange("board")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
            activeTab === "board"
              ? "border-violet-500 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          My Board
          {applications.size > 0 && (
            <span className="ml-2 text-xs bg-violet-600 text-white rounded-full px-1.5 py-0.5">
              {applications.size}
            </span>
          )}
        </button>
        <button
          onClick={() => handleTabChange("alumni")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
            activeTab === "alumni"
              ? "border-violet-500 text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          👥 Alumni Network
          {alumni !== null && (
            <span className="ml-2 text-xs text-slate-500">{alumni.length}</span>
          )}
        </button>
      </div>

      {activeTab === "alumni" ? (
        <AlumniTab alumni={alumni} studentName={studentName} />
      ) : activeTab === "board" ? (
        <ApplicationsBoard
          jobs={jobs}
          applications={applications}
          onStatusChange={handleStatusChange}
        />
      ) : activeTab === "saved" ? (
        <div className="space-y-6">
          {/* Pipeline stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Saved", value: savedJobs.length, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
              { label: "Applied",     value: pipelineStats.applied,   color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
              { label: "Interviewing",value: pipelineStats.interview, color: "text-amber-400",  bg: "bg-amber-500/10 border-amber-500/20" },
              { label: "Offers",      value: pipelineStats.offer,     color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20" },
            ].map((card) => (
              <div key={card.label} className={`glass rounded-2xl p-4 border ${card.bg}`}>
                <p className={`text-2xl font-black ${card.color}`}>{card.value}</p>
                <p className="text-slate-400 text-sm mt-1">{card.label}</p>
              </div>
            ))}
          </div>

          {savedJobs.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center text-slate-400">
              <p className="text-2xl mb-3">☆</p>
              <p className="font-medium text-white mb-1">No saved jobs yet</p>
              <p className="text-sm">Click &quot;☆ Save&quot; on any job card to track it here.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {savedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  status={applications.get(job.id) ?? null}
                  onStatusChange={handleStatusChange}
                  roleTracks={currentTracks}
                  studentName={studentName}
                  studentUniversity={studentUniversity}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <FiltersSidebar
            filters={filters}
            onChange={setFilters}
            totalShowing={filtered.length}
            totalAll={
              activeTab === "h1b_verified" ? verifiedH1BCount :
              activeTab === "rarely_sponsors" ? rarelySponsorCount :
              jobs.length
            }
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
                    roleTracks={currentTracks}
                    studentName={studentName}
                    studentUniversity={studentUniversity}
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
