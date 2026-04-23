"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaitlistModal } from "./waitlist-modal";

interface HeroProps {
  jobCount?: number;
  betaFull?: boolean;
}

export function Hero({ jobCount = 0, betaFull = false }: HeroProps) {
  const [open, setOpen] = useState(false);

  const jobBadge = jobCount > 0
    ? `${jobCount.toLocaleString()}+ jobs matched today`
    : "Thousands of jobs matched today";

  return (
    <>
      {/* Urgency bar */}
      {!betaFull && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-2.5 px-6 text-center">
          <p className="text-amber-300 text-sm font-medium">
            ⏰ Time matters — the average OPT student has{" "}
            <span className="font-bold text-amber-200">90 days</span> to find a job after graduation
          </p>
        </div>
      )}

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-glow">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(124,58,237,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-violet-300 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_2px_rgba(74,222,128,0.5)]" />
            <span>Live — {jobBadge} · F1 &amp; OPT Friendly</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in">
            <span className="text-white">Land Your Dream Job </span>
            <span className="gradient-text">Before Your OPT Expires</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            AI-powered job matching for F1/OPT/STEM OPT/H1B students —{" "}
            <span className="text-white font-semibold">100% FREE.</span>{" "}
            Get matched with verified H1B sponsors in seconds, not months.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            {betaFull ? (
              <Link
                href="/premium"
                className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-all"
              >
                View Premium Services →
              </Link>
            ) : (
              <Button variant="gradient" size="lg" onClick={() => setOpen(true)}>
                Start Matching Jobs Free <ArrowRight className="w-5 h-5" />
              </Button>
            )}
            <Button variant="outline" size="lg" asChild>
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-8 sm:gap-14 mt-12 flex-wrap animate-fade-in">
            {[
              { value: "$120K+",  label: "Avg. Matched Salary" },
              { value: "100% FREE", label: "Forever for Beta Users" },
              { value: "24K+",    label: "Verified H1B Employers" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {open && <WaitlistModal onClose={() => setOpen(false)} />}
    </>
  );
}
