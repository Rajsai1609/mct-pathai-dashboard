"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "./score-ring";
import { cn, getLogoGradient, GRADE_BG } from "@/lib/utils";
import type { JobMatch } from "@/lib/types";

const COMPANY_DOMAINS: Record<string, string> = {
  "databricks":  "databricks.com",
  "openai":      "openai.com",
  "mongodb":     "mongodb.com",
  "notion":      "notion.so",
  "ramp":        "ramp.com",
  "stripe":      "stripe.com",
  "datadog":     "datadoghq.com",
};

function CompanyLogo({ company, gradient }: { company: string; gradient: string }) {
  const [imgError, setImgError] = useState(false);
  const domain = COMPANY_DOMAINS[company.toLowerCase().trim()];

  const fallback = (
    <div
      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 text-white font-bold text-base shadow-md`}
    >
      {company.charAt(0).toUpperCase()}
    </div>
  );

  if (!domain || imgError) return fallback;

  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      onError={() => setImgError(true)}
      alt={company}
      className="w-11 h-11 rounded-xl object-contain bg-white p-1.5 flex-shrink-0 shadow-md"
    />
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

export function JobCard({ job }: JobCardProps) {
  const isRemote = job.work_mode === "remote";
  const isHybrid = job.work_mode === "hybrid";
  const [sourceLabel, sourceCls] = getSource(job.id);

  return (
    <div className="glass glass-hover rounded-2xl p-5 flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-start gap-3">
        {/* Company logo */}
        <CompanyLogo company={job.company} gradient={getLogoGradient(job.company)} />

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

      {/* Grade badge + source + visa badges */}
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
