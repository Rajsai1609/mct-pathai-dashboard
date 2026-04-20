"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { StatsCards } from "./stats-cards";
import { JobCard } from "./job-card";
import { FiltersSidebar, type FilterState } from "./filters-sidebar";
import { ApplicationsBoard } from "./applications-board";
import { AlumniTab } from "./alumni-tab";
import { QuickViewPills } from "./quick-view-pills";
import { QuickStatsBar } from "./quick-stats-bar";
import { cn } from "@/lib/utils";
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
  locations: new Set<string>(),
  citySearch: "",
};

const SORT_OPTIONS = [
  { value: "match_desc",   label: "Match Score ↓" },
  { value: "match_asc",    label: "Match Score ↑" },
  { value: "newest",       label: "Newest First" },
  { value: "company_az",   label: "Company A–Z" },
  { value: "h1b_verified", label: "H1B Verified First" },
] as const;

type SortOption = typeof SORT_OPTIONS[number]["value"];
type H1BSubFilter = "all" | "verified" | "rarely" | "unknown";
type Tab = "jobs" | "h1b_verified" | "rarely_sponsors" | "saved" | "board" | "alumni";

const FAANG_UNICORNS = new Set([
  "google", "meta", "apple", "amazon", "netflix", "microsoft",
  "openai", "anthropic", "databricks", "stripe", "airbnb", "uber",
  "lyft", "snap", "twitter", "x", "linkedin", "salesforce",
  "palantir", "snowflake", "datadog", "confluent", "figma",
  "notion", "canva", "discord", "twilio", "okta", "crowdstrike",
  "ramp", "brex", "plaid", "coinbase", "robinhood", "chime",
]);

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
  const [activePills, setActivePills] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>("match_desc");
  const [h1bSubFilter, setH1BSubFilter] = useState<H1BSubFilter>("all");

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

  const handlePillToggle = (id: string) => {
    setActivePills((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const verifiedH1BCount = useMemo(
    () => jobs.filter((j) => (j.visa_score ?? 0) >= 70).length,
    [jobs],
  );
  const rarelySponsorCount = useMemo(
    () => jobs.filter((j) => { const s = j.visa_score ?? 0; return s >= 30 && s < 70; }).length,
    [jobs],
  );

  // Sidebar + tab filters only (no H1B sub-filter) — used to compute H1B sub-tab counts
  const filteredBase = useMemo(() => {
    return jobs.filter((job) => {
      if (activeTab === "h1b_verified" && (job.visa_score ?? 0) < 70) return false;
      if (activeTab === "rarely_sponsors") {
        const s = job.visa_score ?? 0;
        if (s < 30 || s >= 70) return false;
      }
      if (filters.grades.size > 0 && !filters.grades.has(job.grade)) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!job.company.toLowerCase().includes(q) && !job.title.toLowerCase().includes(q)) return false;
      }
      if (filters.workMode !== "all" && job.work_mode !== filters.workMode) return false;
      if (filters.visaOnly && job.visa_flag) return false;
      if (filters.h1bOnly && job.h1b_sponsor !== true) return false;
      if (filters.verifiedH1BOnly && (job.visa_score ?? 0) < 70) return false;
      if (filters.locations.size > 0) {
        const locLower = (job.location ?? "").toLowerCase();
        const cityQ = filters.citySearch.toLowerCase().trim();
        const stateMatch = [...filters.locations].some((loc) => {
          if (loc === "Remote") return job.work_mode === "remote";
          return locLower.includes(loc.toLowerCase());
        });
        if (!stateMatch) return false;
        if (cityQ && !locLower.includes(cityQ)) return false;
      } else if (filters.citySearch.trim()) {
        const cityQ = filters.citySearch.toLowerCase().trim();
        if (!(job.location ?? "").toLowerCase().includes(cityQ)) return false;
      }
      return true;
    });
  }, [jobs, filters, activeTab]);

  const h1bCounts = useMemo(() => ({
    verified: filteredBase.filter((j) => (j.visa_score ?? 0) >= 70).length,
    rarely:   filteredBase.filter((j) => { const s = j.visa_score ?? 0; return s >= 30 && s < 70; }).length,
    unknown:  filteredBase.filter((j) => (j.visa_score ?? 0) < 30).length,
  }), [filteredBase]);

  // Apply H1B sub-filter (jobs tab only)
  const filtered = useMemo(() => {
    if (activeTab !== "jobs") return filteredBase;
    if (h1bSubFilter === "verified") return filteredBase.filter((j) => (j.visa_score ?? 0) >= 70);
    if (h1bSubFilter === "rarely")   return filteredBase.filter((j) => { const s = j.visa_score ?? 0; return s >= 30 && s < 70; });
    if (h1bSubFilter === "unknown")  return filteredBase.filter((j) => (j.visa_score ?? 0) < 30);
    return filteredBase;
  }, [filteredBase, activeTab, h1bSubFilter]);

  // Apply quick-view pills, sort, and top10 slice
  const displayJobs = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString().split("T")[0];

    let result = filtered.filter((job) => {
      if (activePills.has("verified")   && (job.visa_score ?? 0) < 70) return false;
      if (activePills.has("remote")     && job.work_mode !== "remote") return false;
      if (activePills.has("high_match") && job.fit_pct < 70) return false;
      if (activePills.has("top_grade")  && job.grade !== "A+" && job.grade !== "A") return false;
      if (activePills.has("faang")) {
        const co = job.company.toLowerCase().trim();
        if (!FAANG_UNICORNS.has(co)) return false;
      }
      if (activePills.has("new_week")) {
        if (!job.date_posted || job.date_posted < weekAgo) return false;
      }
      return true;
    });

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === "match_desc")   return b.fit_pct - a.fit_pct;
      if (sortBy === "match_asc")    return a.fit_pct - b.fit_pct;
      if (sortBy === "newest")       return (b.date_posted ?? "").localeCompare(a.date_posted ?? "");
      if (sortBy === "company_az")   return a.company.localeCompare(b.company);
      if (sortBy === "h1b_verified") return (b.visa_score ?? 0) - (a.visa_score ?? 0);
      return 0;
    });

    // top10 pill slices after sort
    if (activePills.has("top10")) result = result.slice(0, 10);

    return result;
  }, [filtered, activePills, sortBy]);

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

  // suppress unused warning — handleTracksChange kept for future settings UI
  void trackSaved;
  void handleTracksChange;
  void currentTracks;

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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Saved", value: savedJobs.length,          color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
              { label: "Applied",     value: pipelineStats.applied,      color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
              { label: "Interviewing",value: pipelineStats.interview,    color: "text-amber-400",  bg: "bg-amber-500/10 border-amber-500/20" },
              { label: "Offers",      value: pipelineStats.offer,        color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20" },
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
            totalShowing={displayJobs.length}
            totalAll={
              activeTab === "h1b_verified" ? verifiedH1BCount :
              activeTab === "rarely_sponsors" ? rarelySponsorCount :
              jobs.length
            }
          />

          <div className="flex-1 min-w-0 space-y-4">
            {/* H1B sub-tabs — jobs tab only */}
            {activeTab === "jobs" && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {(["all", "verified", "rarely", "unknown"] as H1BSubFilter[]).map((sub) => {
                  const labels: Record<H1BSubFilter, string> = {
                    all:      "All",
                    verified: "🟢 Verified",
                    rarely:   "🟡 Rarely",
                    unknown:  "⚫ Unknown",
                  };
                  const counts: Record<H1BSubFilter, number> = {
                    all:      filteredBase.length,
                    verified: h1bCounts.verified,
                    rarely:   h1bCounts.rarely,
                    unknown:  h1bCounts.unknown,
                  };
                  const activeColors: Record<H1BSubFilter, string> = {
                    all:      "bg-violet-600 border-violet-500 text-white",
                    verified: "bg-green-600 border-green-500 text-white",
                    rarely:   "bg-yellow-600 border-yellow-500 text-white",
                    unknown:  "bg-slate-600 border-slate-500 text-white",
                  };
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setH1BSubFilter(sub)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                        h1bSubFilter === sub
                          ? activeColors[sub]
                          : "bg-white/5 border-white/10 text-slate-400 hover:border-white/25",
                      )}
                    >
                      {labels[sub]}
                      <span className="ml-1.5 opacity-70">{counts[sub]}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Quick View Pills */}
            <QuickViewPills activePills={activePills} onToggle={handlePillToggle} />

            {/* Stats bar + sort row */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <QuickStatsBar allJobs={jobs} displayJobs={displayJobs} />
              </div>
              <div className="relative flex-shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none pl-3 pr-7 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-medium focus:outline-none focus:border-violet-500/50 cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
              </div>
            </div>

            {displayJobs.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center text-slate-400">
                No jobs match the current filters.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {displayJobs.map((job) => (
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
