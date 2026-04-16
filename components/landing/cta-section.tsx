"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
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
            <div className="inline-flex items-center gap-2 bg-violet-500/20 text-violet-300 rounded-full px-4 py-1.5 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Powered by MCTechnology LLC
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Find Your{" "}
              <span className="gradient-text">Perfect Role?</span>
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Get early access to AI-powered job matching built specifically for
              international students navigating the US job market.
            </p>
            <Button variant="gradient" size="lg" onClick={() => setOpen(true)}>
              Get Early Access →
            </Button>
          </div>
        </div>
      </section>

      {open && <WaitlistModal onClose={() => setOpen(false)} />}
    </>
  );
}
