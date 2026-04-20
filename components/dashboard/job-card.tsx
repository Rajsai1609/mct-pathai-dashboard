"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { MapPin, ExternalLink, CheckCircle2, XCircle, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "./score-ring";
import { AlumniModal } from "./alumni-modal";
import { cn, GRADE_BG } from "@/lib/utils";
import type { JobMatch, ApplicationStatus, Alumni } from "@/lib/types";
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

interface JobCardProps {
  job: JobMatch;
  status?: ApplicationStatus | null;
  onStatusChange?: (jobId: string, status: ApplicationStatus | null) => void;
  roleTracks?: string[];
  studentName?: string;
  studentUniversity?: string;
}

export function JobCard({ job, status, onStatusChange, roleTracks: _roleTracks, studentName, studentUniversity }: JobCardProps) {
  const isRemote = job.work_mode === "remote";
  const isHybrid = job.work_mode === "hybrid";
  const freshness = getFreshnessBadge(job.date_posted);
  const isSaved = status != null;

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
      {/* Line 1: Logo + Company + Score ring */}
      <div className="flex items-center gap-2.5">
        <CompanyLogo company={job.company} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-300 text-xs font-medium truncate">{job.company}</span>
            {(job.visa_score ?? 0) >= 70 && (
              <span className="text-[11px] leading-none" title="DOL-verified H1B sponsor">🟢</span>
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

      {/* Alumni modal */}
      {alumniOpen && alumni !== null && (
        <AlumniModal
          alumni={alumni}
          company={job.company}
          studentName={studentName ?? "You"}
          onClose={() => setAlumniOpen(false)}
        />
      )}

      {/* Actions: Save/status button + Apply Now */}
      <div className="flex gap-2 mt-auto">
        {onStatusChange && (
          isSaved ? (
            <div className="relative flex-shrink-0">
              <select
                value={status ?? "saved"}
                onChange={(e) => {
                  const val = e.target.value;
                  onStatusChange(job.id, val === "" ? null : val as ApplicationStatus);
                }}
                className="appearance-none pl-3 pr-6 py-1.5 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-xs font-medium focus:outline-none focus:border-yellow-500/70 cursor-pointer"
              >
                <option value="saved">⭐ Saved</option>
                <option value="applied">📧 Applied</option>
                <option value="interview">💬 Interviewing</option>
                <option value="offer">🎉 Offer</option>
                <option value="rejected">❌ Rejected</option>
                <option value="">✕ Remove</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-yellow-300" />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onStatusChange(job.id, "saved")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex-shrink-0 bg-white/5 border-white/15 text-slate-400 hover:border-white/30 hover:text-slate-200"
            >
              ☆ Save
            </button>
          )
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
