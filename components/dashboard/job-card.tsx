import Link from "next/link";
import { MapPin, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "./score-ring";
import { cn, getLogoGradient, GRADE_BG } from "@/lib/utils";
import type { JobMatch } from "@/lib/types";

interface JobCardProps {
  job: JobMatch;
}

export function JobCard({ job }: JobCardProps) {
  const isRemote = job.work_mode === "remote";
  const isHybrid = job.work_mode === "hybrid";

  return (
    <div className="glass glass-hover rounded-2xl p-5 flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-start gap-3">
        {/* Company logo initial */}
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${getLogoGradient(job.company)} flex items-center justify-center flex-shrink-0 text-white font-bold text-base shadow-md`}
        >
          {job.company.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm leading-tight truncate">
            {job.title}
          </p>
          <p className="text-slate-400 text-xs mt-0.5 truncate">{job.company}</p>
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

      {/* Grade badge + visa badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold",
            GRADE_BG[job.grade],
          )}
        >
          {job.grade}
        </span>

        {job.h1b_sponsor === true && (
          <Badge className="text-[10px] py-0 px-2 bg-violet-500/15 text-violet-300 border-violet-500/25 gap-1">
            <CheckCircle2 className="w-3 h-3" /> H1B
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
