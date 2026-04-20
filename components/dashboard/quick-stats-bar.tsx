import type { JobMatch } from "@/lib/types";

interface QuickStatsBarProps {
  allJobs: JobMatch[];
  displayJobs: JobMatch[];
}

export function QuickStatsBar({ allJobs, displayJobs }: QuickStatsBarProps) {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().split("T")[0];

  const topMatch = displayJobs.length > 0 ? Math.max(...displayJobs.map((j) => j.fit_pct)) : 0;
  const avgMatch =
    displayJobs.length > 0
      ? Math.round(displayJobs.reduce((s, j) => s + j.fit_pct, 0) / displayJobs.length)
      : 0;
  const verifiedCount = allJobs.filter((j) => (j.visa_score ?? 0) >= 70).length;
  const rareCount = allJobs.filter((j) => {
    const s = j.visa_score ?? 0;
    return s >= 30 && s < 70;
  }).length;
  const todayCount  = allJobs.filter((j) => j.date_posted?.startsWith(today)).length;
  const yestCount   = allJobs.filter((j) => j.date_posted?.startsWith(yesterday)).length;

  return (
    <div className="glass rounded-xl px-4 py-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs">
      <span className="text-slate-300">
        🎯 Showing{" "}
        <span className="text-violet-400 font-semibold">{displayJobs.length}</span>{" "}
        of{" "}
        <span className="text-white font-semibold">{allJobs.length}</span> jobs
      </span>
      <span className="text-slate-500">
        Top:{" "}
        <span className="text-white">{topMatch}%</span>
        {" · "}
        Avg:{" "}
        <span className="text-white">{avgMatch}%</span>
      </span>
      <span className="text-slate-500">
        🟢 Verified:{" "}
        <span className="text-green-400">{verifiedCount}</span>
        {" · "}
        🟡 Rarely:{" "}
        <span className="text-yellow-400">{rareCount}</span>
      </span>
      <span className="text-slate-500">
        🆕 Today:{" "}
        <span className="text-white">{todayCount}</span>
        {" · "}
        Yesterday:{" "}
        <span className="text-white">{yestCount}</span>
      </span>
    </div>
  );
}
