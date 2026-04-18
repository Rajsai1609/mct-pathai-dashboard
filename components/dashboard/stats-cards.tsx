import { Briefcase, TrendingUp, Star, Sparkles } from "lucide-react";
import type { DashboardStats } from "@/lib/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      icon: Briefcase,
      label: "Matched Jobs",
      value: stats.totalMatched.toLocaleString(),
      sub: "fit score ≥ 40%",
      color: "text-violet-400",
      bg: "bg-violet-500/10 border-violet-500/20",
    },
    {
      icon: TrendingUp,
      label: "Top Match Score",
      value: `${stats.topScore}%`,
      sub: "best fit found",
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: Star,
      label: "A / A+ Matches",
      value: stats.topGradeCount.toLocaleString(),
      sub: "high-fit roles",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: Sparkles,
      label: "New Today",
      value: stats.newJobsToday.toLocaleString(),
      sub: "posted today",
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <div key={i} className={`glass rounded-2xl p-5 border ${c.bg}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${c.bg} border`}>
              <c.icon className={`w-5 h-5 ${c.color}`} />
            </div>
            <span className="text-slate-400 text-sm">{c.label}</span>
          </div>
          <p className={`text-3xl font-black ${c.color}`}>{c.value}</p>
          <p className="text-slate-500 text-xs mt-1">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
