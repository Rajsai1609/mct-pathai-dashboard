"use client";

import { useState } from "react";
import { Flame, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaitlistModal } from "./waitlist-modal";

const BETA_LIMIT = 20;

interface CtaSectionProps {
  studentCount: number;
}

export function CtaSection({ studentCount }: CtaSectionProps) {
  const [open, setOpen] = useState(false);

  const remaining  = Math.max(0, BETA_LIMIT - studentCount);
  const isFull     = remaining === 0;

  const urgencyText = isFull
    ? "Beta is full — join the waitlist"
    : `🔥 Only ${remaining} spot${remaining === 1 ? "" : "s"} left — first come first served!`;

  const urgencyStyle = isFull
    ? "bg-slate-500/20 text-slate-300 border-slate-500/30"
    : "bg-red-500/20 text-red-300 border-red-500/30";

  return (
    <>
      <section className="py-24 container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-12 gradient-border relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-blue-600/10 rounded-3xl" />
          <div className="relative z-10">

            {/* Urgency badge */}
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm mb-6 border ${urgencyStyle}`}>
              {isFull ? <Users className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
              {urgencyText}
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Find Your{" "}
              <span className="gradient-text">Perfect Role?</span>
            </h2>

            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              {isFull
                ? "Our beta is currently full. Join the waitlist and we'll notify you as soon as a spot opens up."
                : "Join the first 20 beta students and get FREE access to AI-powered job matching built specifically for F1, OPT & H1B students."}
            </p>

            {/* Slot bar — only shown when there are spots */}
            {!isFull && (
              <div className="max-w-xs mx-auto mb-8">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>{studentCount} students joined</span>
                  <span>{remaining} spot{remaining === 1 ? "" : "s"} left</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full transition-all duration-700"
                    style={{ width: `${(studentCount / BETA_LIMIT) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <Button variant="gradient" size="lg" onClick={() => setOpen(true)}>
              {isFull ? "Join Waitlist →" : "Claim Your Free Spot →"}
            </Button>

            {isFull ? (
              <p className="text-slate-500 text-xs mt-4">
                Beta is full — you&apos;ll be notified when spots open.
              </p>
            ) : (
              <p className="text-slate-500 text-xs mt-4">
                No credit card · Takes 30 seconds · Powered by MCTechnology LLC
              </p>
            )}
          </div>
        </div>
      </section>

      {open && <WaitlistModal onClose={() => setOpen(false)} />}
    </>
  );
}
