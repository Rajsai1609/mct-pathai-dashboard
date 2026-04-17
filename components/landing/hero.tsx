"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaitlistModal } from "./waitlist-modal";

interface HeroProps {
  jobCount?: number;
}

export function Hero({ jobCount = 0 }: HeroProps) {
  const [open, setOpen] = useState(false);

  const jobBadge = jobCount > 0
    ? `${jobCount.toLocaleString()}+ Jobs Daily`
    : "Thousands of Jobs Daily";

  return (
    <>
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
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered · F1 &amp; OPT Friendly · {jobBadge}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in">
            <span className="text-white">Find Jobs That </span>
            <span className="gradient-text">Match You</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            MCT PathAI uses AI to match international students with visa-friendly
            roles — scored and ranked specifically for your resume, skills, and
            OPT/H1B eligibility.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button variant="gradient" size="lg" onClick={() => setOpen(true)}>
              Get Early Access <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#how-it-works">How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {open && <WaitlistModal onClose={() => setOpen(false)} />}
    </>
  );
}
