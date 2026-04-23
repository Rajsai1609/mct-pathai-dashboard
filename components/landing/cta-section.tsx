"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaitlistModal } from "./waitlist-modal";

const BETA_LIMIT = 50;

const BENEFITS = [
  "100% FREE forever (beta users)",
  "Set up in 30 seconds",
  "No credit card required",
  "Instant access to your dashboard",
];

interface CtaSectionProps {
  studentCount: number;
}

export function CtaSection({ studentCount }: CtaSectionProps) {
  const [open, setOpen] = useState(false);

  const remaining  = Math.max(0, BETA_LIMIT - studentCount);
  const isFull     = remaining === 0;

  const urgencyText = isFull
    ? "Beta is full — join the waitlist"
    : `⏰ Beta closes soon — FREE access ends when we hit ${BETA_LIMIT} users`;

  const urgencyStyle = isFull
    ? "bg-slate-500/20 text-slate-300 border-slate-500/30"
    : "bg-red-500/20 text-red-300 border-red-500/30";

  return (
    <>
      <section id="waitlist" className="py-24 container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-12 gradient-border relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-blue-600/10 rounded-3xl" />
          <div className="relative z-10">

            {/* Urgency badge */}
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm mb-6 border ${urgencyStyle}`}>
              {isFull ? <Users className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
              {urgencyText}
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Stop Waiting.{" "}
              <span className="gradient-text">Start Matching.</span>
            </h2>

            <p className="text-slate-400 mb-6 max-w-lg mx-auto">
              {isFull
                ? "Beta is currently full. Upgrade to a premium plan for immediate access and start matching with H1B sponsors today."
                : `Join ${studentCount} international students already using MCT PathAI. Only ${remaining} FREE beta spot${remaining === 1 ? "" : "s"} left.`}
            </p>

            {/* Benefits checklist */}
            {!isFull && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 justify-center mb-8">
                {BENEFITS.map((b) => (
                  <div key={b} className="flex items-center gap-1.5 text-slate-300 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Slot bar */}
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

            {isFull ? (
              <div className="flex flex-col items-center gap-2 mt-2">
                <Link
                  href="/premium"
                  className="inline-block bg-gradient-to-r from-purple-500 to-blue-500
                             text-white px-10 py-4 rounded-xl font-bold text-lg
                             hover:opacity-90 hover:scale-[1.03] transition-all
                             shadow-lg shadow-purple-500/20"
                >
                  View Premium Services →
                </Link>
                <p className="text-slate-400 text-sm">
                  Skip the waitlist · Plans from $299
                </p>

              </div>
            ) : (
              <>
                <Button variant="gradient" size="lg" onClick={() => setOpen(true)}>
                  Claim Your Free Spot →
                </Button>
                <p className="text-slate-500 text-xs mt-4">
                  No credit card · Takes 30 seconds · Powered by MCTechnology LLC
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {open && <WaitlistModal onClose={() => setOpen(false)} />}
    </>
  );
}
