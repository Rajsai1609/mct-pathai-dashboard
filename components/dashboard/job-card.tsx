"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MapPin, ExternalLink, CheckCircle2, XCircle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "./score-ring";
import { AlumniModal } from "./alumni-modal";
import { cn, GRADE_BG } from "@/lib/utils";
import type { JobMatch, ApplicationStatus, Alumni } from "@/lib/types";
import { getMatchedTrack } from "@/lib/role-tracks";
import { fetchAlumniAtCompany } from "@/lib/supabase";

const COMPANY_COLORS: Record<string, string> = {
  "databricks": "bg-red-500",
  "openai":     "bg-green-600",
  "mongodb":    "bg-green-500",
  "notion":     "bg-gray-800",
  "ramp":       "bg-yellow-500",
  "stripe":     "bg-purple-600",
  "datadog":    "bg-purple-500",
  "google":     "bg-blue-500",
  "microsoft":  "bg-blue-600",
  "amazon":     "bg-orange-500",
  "meta":       "bg-blue-700",
  "apple":      "bg-gray-700",
  "netflix":    "bg-red-600",
  "default":    "bg-gradient-to-br from-purple-500 to-blue-500",
};

function H1BBadge({ visa_score, h1b_count }: { visa_score?: number | null; h1b_count?: number | null }) {
  if (visa_score == null) return null;
  if (visa_score >= 70) return (
    <span className="relative group inline-flex items-center gap-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full px-1.5 py-0 text-[10px] font-medium cursor-default">
      🟢 H1B Verified
      {(h1b_count ?? 0) > 0 && <span className="opacity-60">·{h1b_count}</span>}
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-48 rounded-lg bg-slate-900 border border-white/10 p-2 text-[10px] text-slate-300 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-xl">
        DOL-verified: filed {h1b_count ?? 0}+ H1Bs with US Dept of Labor.
        <br />🟢 ≥70 · 🟡 30–69 · no badge = unknown
      </span>
    </span>
  );
  if (visa_score >= 30) return (
    <span className="relative group inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full px-1.5 py-0 text-[10px] font-medium cursor-default">
      🟡 Rarely Sponsors
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-44 rounded-lg bg-slate-900 border border-white/10 p-2 text-[10px] text-slate-300 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-xl">
        Limited H1B history in DOL records. May sponsor — verify before applying.
      </span>
    </span>
  );
  return null;
}

function CompanyLogo({ company }: { company: string }) {
  const initial = company.charAt(0).toUpperCase();
  const color   = COMPANY_COLORS[company.toLowerCase().trim()] ?? COMPANY_COLORS["default"];
  return (
    <div className={`${color} rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0 text-white font-bold text-base shadow-md`}>
      {initial}
    </div>
  );
}

function getFreshnessBadge(datePosted: string | null | undefined): { label: string; cls: string } | null {
  if (!datePosted) return null;
  const diffDays = Math.floor((Date.now() - new Date(datePosted).getTime()) / 86_400_000);
  if (diffDays === 0) return { label: "New Today", cls: "bg-green-500/15 text-green-400 border-green-500/25" };
  if (diffDays === 1) return { label: "Yesterday", cls: "bg-blue-500/15 text-blue-400 border-blue-500/25" };
  if (diffDays <= 7) return { label: `${diffDays}d ago`, cls: "bg-slate-500/15 text-slate-400 border-slate-500/25" };
  return null;
}

const STATUS_OPTIONS: { value: ApplicationStatus; label: string; activeClass: string }[] = [
  { value: "saved",     label: "Saved",     activeClass: "bg-slate-600 border-slate-500 text-white" },
  { value: "applied",   label: "Applied",   activeClass: "bg-violet-600 border-violet-500 text-white" },
  { value: "interview", label: "Interview", activeClass: "bg-amber-600 border-amber-500 text-white" },
  { value: "offer",     label: "Offer",     activeClass: "bg-green-600 border-green-500 text-white" },
  { value: "rejected",  label: "Rejected",  activeClass: "bg-red-700 border-red-600 text-white" },
];

interface JobCardProps {
  job: JobMatch;
  status?: ApplicationStatus | null;
  onStatusChange?: (jobId: string, status: ApplicationStatus | null) => void;
  statusDropdown?: boolean;
  roleTracks?: string[];
  studentName?: string;
  studentUniversity?: string;
}

export function JobCard({ job, status, onStatusChange, statusDropdown, roleTracks, studentName, studentUniversity }: JobCardProps) {
  const isRemote = job.work_mode === "remote";
  const isHybrid = job.work_mode === "hybrid";
  const freshness = getFreshnessBadge(job.date_posted);
  const isSaved = status != null;
  const matchedTrack = roleTracks && roleTracks.length > 1
    ? getMatchedTrack(`${job.title} ${job.job_category ?? ""}`, roleTracks)
    : null;

  const [alumni, setAlumni] = useState<Alumni[] | null>(null);
  const [alumniOpen, setAlumniOpen] = useState(false);
  const fetchedRef = useRef(false);

  const handleAlumniClick = async () => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      const data = await fetchAlumniAtCompany(job.company, studentUniversity);
      setAlumni(data);
    }
    setAlumniOpen(true);
  };

  return (
    <div className="glass glass-hover rounded-2xl p-4 flex flex-col gap-3">
      {/* Line 1: Logo + Company + H1B badge + Score ring */}
      <div className="flex items-center gap-2.5">
        <CompanyLogo company={job.company} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-300 text-xs font-medium truncate">{job.company}</span>
            <H1BBadge visa_score={job.visa_score} h1b_count={job.h1b_count} />
            {job.visa_score == null && job.h1b_sponsor === true && (
              <span className="inline-flex items-center gap-1 bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-full px-1.5 py-0 text-[10px] font-medium">
                <CheckCircle2 className="w-2.5 h-2.5" /> H1B
              </span>
            )}
          </div>
          {/* Line 2: Job title */}
          <p className="text-white font-semibold text-sm leading-snug mt-0.5 line-clamp-2">
            {job.title}
          </p>
        </div>
        <ScoreRing score={job.fit_pct} grade={job.grade} size={48} />
      </div>

      {/* Line 3: Location + work mode */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
        <span className="text-slate-400 text-xs truncate flex-1">
          {job.location || "Location not specified"}
        </span>
        {isRemote && (
          <Badge className="text-[10px] py-0 px-1.5 bg-emerald-500/15 text-emerald-400 border-emerald-500/25">
            Remote
          </Badge>
        )}
        {isHybrid && (
          <Badge className="text-[10px] py-0 px-1.5 bg-blue-500/15 text-blue-400 border-blue-500/25">
            Hybrid
          </Badge>
        )}
      </div>

      {/* Line 4: Grade + freshness + misc badges */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={cn("inline-flex items-center rounded-full border px-2 py-0 text-[10px] font-bold", GRADE_BG[job.grade])}>
          {job.grade}
        </span>
        <span className="text-slate-500 text-[10px]">{job.fit_pct}% match</span>

        {freshness && (
          <Badge className={cn("text-[10px] py-0 px-1.5", freshness.cls)}>
            {freshness.label}
          </Badge>
        )}
        {job.opt_friendly === true && (
          <Badge className="text-[10px] py-0 px-1.5 bg-blue-500/15 text-blue-300 border-blue-500/25 gap-0.5">
            <CheckCircle2 className="w-2.5 h-2.5" /> OPT
          </Badge>
        )}
        {job.visa_flag && (
          <Badge className="text-[10px] py-0 px-1.5 bg-red-500/15 text-red-400 border-red-500/25 gap-0.5">
            <XCircle className="w-2.5 h-2.5" /> Visa Flag
          </Badge>
        )}
        {job.is_entry_eligible && (
          <Badge className="text-[10px] py-0 px-1.5 bg-amber-500/15 text-amber-300 border-amber-500/25">
            Entry
          </Badge>
        )}
      </div>

      {/* Matched track badge — only shown when student has multiple tracks */}
      {matchedTrack && (
        <div className="text-xs text-purple-400 flex items-center gap-1">
          Matched via: {matchedTrack.icon} {matchedTrack.label}
        </div>
      )}

      {/* Alumni badge */}
      <button
        type="button"
        onClick={handleAlumniClick}
        className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors w-fit"
      >
        <Users className="w-3 h-3" />
        {alumni === null
          ? "👥 See alumni here"
          : alumni.length === 0
            ? "No alumni yet"
            : `👥 ${alumni.length} alumni here`
        }
      </button>

      {/* Alumni modal */}
      {alumniOpen && alumni !== null && (
        <AlumniModal
          alumni={alumni}
          company={job.company}
          studentName={studentName ?? "You"}
          onClose={() => setAlumniOpen(false)}
        />
      )}

      {/* Line 5: Status pills or dropdown */}
      {onStatusChange && (
        statusDropdown ? (
          <select
            value={status ?? ""}
            onChange={(e) => {
              const val = e.target.value as ApplicationStatus;
              onStatusChange(job.id, val || null);
            }}
            className="w-full rounded-lg bg-white/5 border border-white/15 text-slate-300 text-xs px-2 py-1.5 focus:outline-none focus:border-violet-500/50"
          >
            <option value="">— Update status —</option>
            <option value="saved">📌 Saved</option>
            <option value="applied">📧 Applied</option>
            <option value="interview">💬 Interviewing</option>
            <option value="offer">🎉 Offer</option>
            <option value="rejected">❌ Rejected</option>
          </select>
        ) : (
          <div className="flex gap-1 flex-wrap">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => onStatusChange(job.id, status === s.value ? null : s.value)}
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all",
                  status === s.value
                    ? s.activeClass
                    : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        )
      )}

      {/* Line 6: Save + Apply buttons */}
      <div className="flex gap-2 mt-auto">
        {onStatusChange && (
          <button
            type="button"
            onClick={() => onStatusChange(job.id, isSaved ? null : "saved")}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex-shrink-0",
              isSaved
                ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/30"
                : "bg-white/5 border-white/15 text-slate-400 hover:border-white/30 hover:text-slate-200",
            )}
          >
            {isSaved ? "⭐ Saved" : "☆ Save"}
          </button>
        )}
        <Button variant="outline" size="sm" className={cn("mt-auto", onStatusChange ? "flex-1" : "w-full")} asChild>
          <Link href={job.url} target="_blank" rel="noopener noreferrer">
            Apply Now <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
