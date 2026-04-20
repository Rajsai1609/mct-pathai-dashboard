"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Is MCT PathAI really free?",
    a: "Yes! First 50 students get FREE lifetime access. No credit card required. We may launch paid tiers later but beta users get grandfathered in forever.",
  },
  {
    q: "How does AI matching work?",
    a: "Our AI reads your resume and scores every job across 10 dimensions including skills, visa compatibility, experience level, and semantic fit. You see YOUR best matches — not generic listings.",
  },
  {
    q: "Which companies sponsor H1B?",
    a: "We cross-reference 24,329+ verified H1B employers from the US Department of Labor database. Every job shows 🟢 Verified or 🟡 Rarely Sponsors — no more guessing.",
  },
  {
    q: "How fresh are the jobs?",
    a: "Our pipeline runs every morning at 7AM. Fresh jobs get a 🟢 New Today badge. Old jobs (30+ days) are automatically removed. No stale listings ever.",
  },
  {
    q: "Can I customize my preferences?",
    a: "Yes! Filter by H1B verified only, remote/hybrid/onsite, match score, company, and more. Save favorite jobs and track applications in your personal board.",
  },
  {
    q: "Do I need to apply through MCT PathAI?",
    a: "No! We show you the job and a direct link. You apply on the company's website. We're your job matching assistant, not an application portal.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass rounded-xl border border-white/5 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-white font-medium text-sm">{q}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-slate-400 flex-shrink-0 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 border-t border-white/5">
          <p className="text-slate-400 text-sm leading-relaxed pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

export function FAQSection() {
  return (
    <section className="py-24 bg-gray-900/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">
            FAQ
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Everything you need to know before getting started.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
