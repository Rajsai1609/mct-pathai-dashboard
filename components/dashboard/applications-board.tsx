"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JobMatch, ApplicationStatus } from "@/lib/types";

const COLUMNS: {
  status: ApplicationStatus;
  label: string;
  headerClass: string;
  dotClass: string;
}[] = [
  { status: "saved",     label: "Saved",     headerClass: "border-slate-500/40",   dotClass: "bg-slate-400" },
  { status: "applied",   label: "Applied",   headerClass: "border-violet-500/40",  dotClass: "bg-violet-400" },
  { status: "interview", label: "Interview", headerClass: "border-amber-500/40",   dotClass: "bg-amber-400" },
  { status: "offer",     label: "Offer",     headerClass: "border-green-500/40",   dotClass: "bg-green-400" },
  { status: "rejected",  label: "Rejected",  headerClass: "border-red-500/40",     dotClass: "bg-red-400" },
];

interface ApplicationsBoardProps {
  jobs: JobMatch[];
  applications: Map<string, ApplicationStatus>;
  onStatusChange: (jobId: string, status: ApplicationStatus | null) => void;
}

function KanbanCard({
  job,
  status,
  onStatusChange,
}: {
  job: JobMatch;
  status: ApplicationStatus;
  onStatusChange: (jobId: string, status: ApplicationStatus | null) => void;
}) {
  const nextStatus = COLUMNS[COLUMNS.findIndex((c) => c.status === status) + 1]?.status ?? null;

  return (
    <div className="glass rounded-xl p-3 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-white text-xs font-semibold line-clamp-2 leading-snug">{job.title}</p>
          <p className="text-slate-400 text-[11px] mt-0.5 truncate">{job.company}</p>
        </div>
        <span className="text-slate-500 text-[10px] flex-shrink-0">{job.fit_pct}%</span>
      </div>

      <div className="flex items-center gap-1.5">
        {nextStatus && (
          <button
            type="button"
            onClick={() => onStatusChange(job.id, nextStatus)}
            className="flex-1 text-[10px] rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 py-1 text-slate-300 transition-all"
          >
            Move to {COLUMNS.find((c) => c.status === nextStatus)?.label} →
          </button>
        )}
        <Link
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
        >
          <ExternalLink className="w-3 h-3" />
        </Link>
        <button
          type="button"
          onClick={() => onStatusChange(job.id, null)}
          className="p-1 rounded-lg border border-white/10 bg-white/5 hover:bg-red-500/20 hover:border-red-500/40 text-slate-500 hover:text-red-400 transition-all text-[10px]"
          aria-label="Remove"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function ApplicationsBoard({
  jobs,
  applications,
  onStatusChange,
}: ApplicationsBoardProps) {
  const jobsById = new Map(jobs.map((j) => [j.id, j]));

  const totalTracked = applications.size;
  if (totalTracked === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <p className="text-2xl mb-3">📋</p>
        <h3 className="text-white font-semibold mb-1">No applications tracked yet</h3>
        <p className="text-slate-400 text-sm">
          Use the status pills on any job card in &quot;All Jobs&quot; to start tracking.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-[900px]">
        {COLUMNS.map((col) => {
          const colJobs = [...applications.entries()]
            .filter(([, s]) => s === col.status)
            .map(([jobId]) => jobsById.get(jobId))
            .filter(Boolean) as JobMatch[];

          return (
            <div key={col.status} className="flex-1 min-w-[170px]">
              <div className={cn("flex items-center gap-2 mb-3 pb-2 border-b", col.headerClass)}>
                <span className={cn("w-2 h-2 rounded-full flex-shrink-0", col.dotClass)} />
                <span className="text-white text-xs font-semibold">{col.label}</span>
                <span className="ml-auto text-slate-500 text-xs">{colJobs.length}</span>
              </div>

              <div className="flex flex-col gap-2">
                {colJobs.length === 0 ? (
                  <p className="text-slate-600 text-xs text-center py-4 italic">Empty</p>
                ) : (
                  colJobs.map((job) => (
                    <KanbanCard
                      key={job.id}
                      job={job}
                      status={col.status}
                      onStatusChange={onStatusChange}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
