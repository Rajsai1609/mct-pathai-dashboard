import Link from "next/link";
import { MapPin, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "./score-ring";
import { cn, GRADE_BG } from "@/lib/utils";
import type { JobMatch } from "@/lib/types";

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
    <div className="flex items-center gap-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full px-2 py-0.5 text-xs font-medium">
      🟢 Verified H1B Sponsor
      {(h1b_count ?? 0) > 0 && <span className="opacity-70">· {h1b_count} filings</span>}
    </div>
  );
  if (visa_score >= 30) return (
    <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full px-2 py-0.5 text-xs font-medium">
      🟡 Rarely Sponsors H1B
    </div>
  );
  return (
    <div className="flex items-center gap-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-2 py-0.5 text-xs font-medium">
      🔴 No H1B History
    </div>
  );
}

function CompanyLogo({ company }: { company: string }) {
  const initial = company.charAt(0).toUpperCase();
  const color   = COMPANY_COLORS[company.toLowerCase().trim()] ?? COMPANY_COLORS["default"];

  return (
    <div
      className={`${color} rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 text-white font-bold text-lg shadow-md`}
    >
      {initial}
    </div>
  );
}

interface JobCardProps {
  job: JobMatch;
}

const SOURCE_MAP: [string, string, string][] = [
  ["ashby",      "Ashby",      "bg-pink-500/15 text-pink-300 border-pink-500/25"],
  ["greenhouse", "Greenhouse", "bg-green-500/15 text-green-300 border-green-500/25"],
  ["lever",      "Lever",      "bg-cyan-500/15 text-cyan-300 border-cyan-500/25"],
  ["linkedin",   "LinkedIn",   "bg-blue-500/15 text-blue-300 border-blue-500/25"],
  ["indeed",     "Indeed",     "bg-indigo-500/15 text-indigo-300 border-indigo-500/25"],
];

function getSource(id: string): [string, string] {
  for (const [prefix, label, cls] of SOURCE_MAP) {
    if (id.startsWith(prefix)) return [label, cls];
  }
  return ["Other", "bg-slate-500/15 text-slate-400 border-slate-500/25"];
}

function getFreshnessBadge(datePosted: string | null | undefined): { label: string; cls: string } | null {
  if (!datePosted) return null;
  const diffDays = Math.floor((Date.now() - new Date(datePosted).getTime()) / 86_400_000);
  if (diffDays === 0) return { label: "New Today", cls: "bg-green-500/15 text-green-400 border-green-500/25" };
  if (diffDays === 1) return { label: "Yesterday", cls: "bg-blue-500/15 text-blue-400 border-blue-500/25" };
  if (diffDays <= 7) return { label: `${diffDays}d ago`, cls: "bg-slate-500/15 text-slate-400 border-slate-500/25" };
  return null;
}

export function JobCard({ job }: JobCardProps) {
  const isRemote = job.work_mode === "remote";
  const isHybrid = job.work_mode === "hybrid";
  const [sourceLabel, sourceCls] = getSource(job.id);
  const freshness = getFreshnessBadge(job.date_posted);

  return (
    <div className="glass glass-hover rounded-2xl p-5 flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-start gap-3">
        {/* Company logo */}
        <CompanyLogo company={job.company} />

        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm leading-tight truncate">
            {job.title}
          </p>
          <p className="text-slate-400 text-xs mt-0.5 truncate">{job.company}</p>
          {job.visa_score != null
            ? <H1BBadge visa_score={job.visa_score} h1b_count={job.h1b_count} />
            : job.h1b_sponsor === true && (
              <div className="flex items-center gap-1 bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-full px-2 py-0.5 text-xs font-medium mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> H1B Sponsor
              </div>
            )
          }
        </div>

        {/* Score ring */}
        <ScoreRing score={job.fit_pct} grade={job.grade} size={52} />
      </div>

      {/* Location + work mode */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
        <span className="text-slate-400 text-xs truncate">
          {job.location || "Location not specified"}
        </span>
        {isRemote && (
          <Badge className="ml-auto text-[10px] py-0 px-2 bg-emerald-500/15 text-emerald-400 border-emerald-500/25">
            Remote
          </Badge>
        )}
        {isHybrid && (
          <Badge className="ml-auto text-[10px] py-0 px-2 bg-blue-500/15 text-blue-400 border-blue-500/25">
            Hybrid
          </Badge>
        )}
      </div>

      {/* Grade badge + source + freshness + visa badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold",
            GRADE_BG[job.grade],
          )}
        >
          {job.grade}
        </span>

        <Badge className={cn("text-[10px] py-0 px-2", sourceCls)}>
          {sourceLabel}
        </Badge>

        {freshness && (
          <Badge className={cn("text-[10px] py-0 px-2", freshness.cls)}>
            {freshness.label}
          </Badge>
        )}

        {job.opt_friendly === true && (
          <Badge className="text-[10px] py-0 px-2 bg-blue-500/15 text-blue-300 border-blue-500/25 gap-1">
            <CheckCircle2 className="w-3 h-3" /> OPT
          </Badge>
        )}
        {job.visa_flag && (
          <Badge className="text-[10px] py-0 px-2 bg-red-500/15 text-red-400 border-red-500/25 gap-1">
            <XCircle className="w-3 h-3" /> Visa Flag
          </Badge>
        )}
        {job.is_entry_eligible && (
          <Badge className="text-[10px] py-0 px-2 bg-amber-500/15 text-amber-300 border-amber-500/25">
            Entry Level
          </Badge>
        )}
      </div>

      {/* Apply button */}
      <Button variant="outline" size="sm" className="w-full mt-auto" asChild>
        <Link href={job.url} target="_blank" rel="noopener noreferrer">
          Apply Now <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </Button>
    </div>
  );
}
