"use client";

import { useState } from "react";
import { Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaitlistModal } from "./waitlist-modal";

export function CtaSection() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="py-24 container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-12 gradient-border relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-blue-600/10 rounded-3xl" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 rounded-full px-4 py-1.5 text-sm mb-6 border border-red-500/30">
              <Clock className="w-4 h-4" />
              Only 15 spots left in free beta
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Find Your{" "}
              <span className="gradient-text">Perfect Role?</span>
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Join the first 20 students and get lifetime free access to
              AI-powered job matching built specifically for F1 &amp; OPT visa holders.
            </p>
            <Button variant="gradient" size="lg" onClick={() => setOpen(true)}>
              Get Early Access →
            </Button>
            <p className="text-slate-500 text-xs mt-4">
              No credit card · Takes 30 seconds · Powered by MCTechnology LLC
            </p>
          </div>
        </div>
      </section>

      {open && <WaitlistModal onClose={() => setOpen(false)} />}
    </>
  );
}
