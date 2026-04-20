"use client";

import { useEffect } from "react";
import { ExternalLink, GraduationCap, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Alumni } from "@/lib/types";

interface AlumniModalProps {
  alumni: Alumni[];
  company: string;
  studentName: string;
  onClose: () => void;
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

function openLinkedIn(alumnus: Alumni, company: string, studentName: string) {
  const msg = buildReferralMessage(alumnus.full_name, company, studentName);
  if (alumnus.linkedin_url) {
    window.open(alumnus.linkedin_url, "_blank", "noopener,noreferrer");
  } else {
    const search = encodeURIComponent(`${alumnus.full_name} ${company}`);
    window.open(`https://www.linkedin.com/search/results/people/?keywords=${search}`, "_blank", "noopener,noreferrer");
  }
  navigator.clipboard?.writeText(msg).catch(() => {});
}

const VISA_LABELS: Record<string, string> = {
  h1b: "H1B",
  stem_opt: "STEM OPT",
  opt: "OPT",
  green_card: "Green Card",
  citizen: "US Citizen",
};

export function AlumniModal({ alumni, company, studentName, onClose }: AlumniModalProps) {
  const referrers = alumni.filter((a) => a.willing_to_refer);
  const others    = alumni.filter((a) => !a.willing_to_refer);
  const sorted    = [...referrers, ...others];

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  // ESC key closes modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-900 border border-purple-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-[10001] transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="mb-4 pr-6">
            <div className="flex items-center gap-2 mb-0.5">
              <Users className="w-4 h-4 text-violet-400" />
              <h3 className="text-white font-bold text-lg">Alumni at {company}</h3>
            </div>
            <p className="text-slate-400 text-xs">
              {referrers.length > 0
                ? `${referrers.length} willing to refer · click a card to message on LinkedIn`
                : "Connect with alumni for referrals"}
            </p>
          </div>

          {/* Alumni list */}
          <div className="space-y-3">
            {sorted.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">
                No alumni found for this company yet.
              </p>
            ) : (
              sorted.map((alumnus) => (
                <div
                  key={alumnus.id}
                  className={`rounded-xl border p-3.5 transition-all ${
                    alumnus.willing_to_refer
                      ? "bg-violet-500/5 border-violet-500/20 hover:border-violet-500/40 hover:bg-violet-500/10 cursor-pointer"
                      : "bg-white/3 border-white/8 opacity-60"
                  }`}
                  onClick={() => alumnus.willing_to_refer && openLinkedIn(alumnus, company, studentName)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-semibold text-sm">{alumnus.full_name}</span>
                        {alumnus.willing_to_refer && (
                          <span className="text-[10px] bg-green-500/15 text-green-400 border border-green-500/25 rounded-full px-1.5 py-0">
                            Open to refer
                          </span>
                        )}
                        {alumnus.visa_status && VISA_LABELS[alumnus.visa_status] && (
                          <span className="text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/25 rounded-full px-1.5 py-0">
                            {VISA_LABELS[alumnus.visa_status]}
                          </span>
                        )}
                      </div>

                      {alumnus.current_title && (
                        <p className="text-slate-300 text-xs mt-0.5">{alumnus.current_title}</p>
                      )}

                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                          <GraduationCap className="w-3 h-3" />
                          {alumnus.university}
                          {alumnus.graduation_year && ` · ${alumnus.graduation_year}`}
                        </span>
                        {alumnus.location && (
                          <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                            <MapPin className="w-3 h-3" />
                            {alumnus.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {alumnus.willing_to_refer && (
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center gap-1 text-violet-400 text-[11px]">
                          <ExternalLink className="w-3 h-3" />
                          LinkedIn
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer tip */}
          {referrers.length > 0 && (
            <p className="text-slate-600 text-[11px] mt-3 text-center">
              Clicking a card opens LinkedIn + copies a referral message to your clipboard
            </p>
          )}

          <Button variant="outline" size="sm" onClick={onClose} className="mt-3 w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
