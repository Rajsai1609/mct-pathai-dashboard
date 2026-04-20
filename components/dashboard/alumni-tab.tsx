"use client";

import { useState, useMemo } from "react";
import { Search, GraduationCap, MapPin, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Alumni } from "@/lib/types";

interface AlumniTabProps {
  alumni: Alumni[] | null;
  studentName: string;
}

const VISA_LABELS: Record<string, string> = {
  h1b: "H1B",
  stem_opt: "STEM OPT",
  opt: "OPT",
  green_card: "Green Card",
  citizen: "US Citizen",
};

const AVATAR_COLORS = [
  "bg-violet-600", "bg-blue-600", "bg-emerald-600", "bg-amber-600",
  "bg-rose-600", "bg-cyan-600", "bg-fuchsia-600", "bg-teal-600",
];

function getAvatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function buildReferralMessage(alumniName: string, company: string, studentName: string): string {
  return (
    `Hi ${alumniName.split(" ")[0]},\n\n` +
    `I'm ${studentName}, and I came across your profile while researching opportunities at ${company}. ` +
    `I'm very interested in joining ${company} and would love to connect to learn more about your experience there.\n\n` +
    `If you're open to it, would you be willing to chat briefly and potentially refer me for open roles?\n\n` +
    `Thank you for your time!\n${studentName}`
  );
}

function AlumniCard({ alumnus, studentName }: { alumnus: Alumni; studentName: string }) {
  const handleClick = () => {
    const msg = buildReferralMessage(alumnus.full_name, alumnus.current_company, studentName);
    if (alumnus.linkedin_url) {
      window.open(alumnus.linkedin_url, "_blank", "noopener,noreferrer");
    } else {
      const q = encodeURIComponent(`${alumnus.full_name} ${alumnus.current_company}`);
      window.open(`https://www.linkedin.com/search/results/people/?keywords=${q}`, "_blank", "noopener,noreferrer");
    }
    navigator.clipboard?.writeText(msg).catch(() => {});
  };

  return (
    <div className="glass glass-hover rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className={`${getAvatarColor(alumnus.full_name)} rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 text-white font-bold text-base shadow-md`}>
          {alumnus.full_name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-white font-semibold text-sm">{alumnus.full_name}</span>
            {alumnus.willing_to_refer && (
              <span className="text-[10px] bg-green-500/15 text-green-400 border border-green-500/25 rounded-full px-1.5 py-0">
                Open to refer
              </span>
            )}
          </div>
          <p className="text-slate-300 text-xs mt-0.5">
            {alumnus.current_title ? `${alumnus.current_title} @ ` : ""}{alumnus.current_company}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <GraduationCap className="w-3 h-3" />
          {alumnus.university}{alumnus.graduation_year ? ` · ${alumnus.graduation_year}` : ""}
        </span>
        {alumnus.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {alumnus.location}
          </span>
        )}
      </div>

      {alumnus.visa_status && VISA_LABELS[alumnus.visa_status] && (
        <span className="text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/25 rounded-full px-1.5 py-0 w-fit">
          {VISA_LABELS[alumnus.visa_status]}
        </span>
      )}

      <button
        type="button"
        onClick={handleClick}
        className="mt-auto flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-xs font-medium border transition-all bg-violet-500/10 border-violet-500/30 text-violet-300 hover:bg-violet-500/20 hover:border-violet-500/50"
      >
        <ExternalLink className="w-3 h-3" />
        Message on LinkedIn
      </button>
    </div>
  );
}

export function AlumniTab({ alumni, studentName }: AlumniTabProps) {
  const [search, setSearch] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterUniversity, setFilterUniversity] = useState("");

  const companies = useMemo(
    () => (alumni ? [...new Set(alumni.map((a) => a.current_company))].sort() : []),
    [alumni],
  );
  const universities = useMemo(
    () => (alumni ? [...new Set(alumni.map((a) => a.university))].sort() : []),
    [alumni],
  );

  const filtered = useMemo(() => {
    if (!alumni) return [];
    return alumni.filter((a) => {
      if (search && !a.full_name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterCompany && a.current_company !== filterCompany) return false;
      if (filterUniversity && a.university !== filterUniversity) return false;
      return true;
    });
  }, [alumni, search, filterCompany, filterUniversity]);

  if (alumni === null) {
    return (
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-4 animate-pulse">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 bg-white/10 rounded w-1/2" />
                <div className="h-3 bg-white/10 rounded w-2/3" />
                <div className="h-3 bg-white/10 rounded w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-white font-bold text-xl">👥 Alumni Network</h2>
        <p className="text-slate-400 text-sm mt-1">
          Connect with {alumni.length} alumni at top companies ·{" "}
          <span className="text-green-400">{alumni.filter((a) => a.willing_to_refer).length} willing to refer</span>
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={filterCompany}
          onChange={(e) => setFilterCompany(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
        >
          <option value="" className="bg-slate-900">All Companies</option>
          {companies.map((c) => (
            <option key={c} value={c} className="bg-slate-900">{c}</option>
          ))}
        </select>
        <select
          value={filterUniversity}
          onChange={(e) => setFilterUniversity(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
        >
          <option value="" className="bg-slate-900">All Universities</option>
          {universities.map((u) => (
            <option key={u} value={u} className="bg-slate-900">{u}</option>
          ))}
        </select>
      </div>

      <p className="text-slate-500 text-xs">
        Showing <span className="text-white font-semibold">{filtered.length}</span> of{" "}
        <span className="text-white font-semibold">{alumni.length}</span> alumni
      </p>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center text-slate-400">
          No alumni match the current filters.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((alumnus) => (
            <AlumniCard key={alumnus.id} alumnus={alumnus} studentName={studentName} />
          ))}
        </div>
      )}
    </div>
  );
}
