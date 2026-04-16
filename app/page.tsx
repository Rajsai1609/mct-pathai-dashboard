import { Suspense } from "react";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ValueProps } from "@/components/landing/value-props";
import { ComparisonTable } from "@/components/landing/comparison-table";
import { StatsSection } from "@/components/landing/stats-section";
import { StudentsSection } from "@/components/landing/students-section";
import { CtaSection } from "@/components/landing/cta-section";
import { ContactSection } from "@/components/landing/contact-section";

function StudentsSkeleton() {
  return (
    <section className="py-24 container mx-auto px-6">
      <div className="text-center mb-16">
        <div className="h-4 bg-white/10 rounded w-32 mx-auto mb-3" />
        <div className="h-12 bg-white/10 rounded w-64 mx-auto mb-4" />
        <div className="h-4 bg-white/5 rounded w-96 mx-auto" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="glass rounded-2xl p-6 h-20 animate-pulse" />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0f172a]">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md bg-[#0f172a]/80">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-white font-bold text-lg">
            MCT <span className="gradient-text">PathAI</span>
          </span>
          <span className="text-slate-500 text-sm hidden sm:block">
            Powered by MCTechnology LLC
          </span>
        </div>
      </nav>

      <div className="pt-14">
        {/* 1 — Hero */}
        <Hero />

        {/* 2 — Hero stats */}
        <StatsSection />

        {/* 4 — How it works */}
        <HowItWorks />

        {/* 5 — Built only for international students */}
        <ValueProps />

        {/* 6 — Comparison table */}
        <ComparisonTable />

        {/* 7 — Live student dashboards */}
        <Suspense fallback={<StudentsSkeleton />}>
          <StudentsSection />
        </Suspense>

        {/* 8 — Urgency CTA */}
        <CtaSection />

        {/* 9 — Contact */}
        <ContactSection />
      </div>

      <footer className="border-t border-white/5 py-8 text-center text-slate-500 text-sm space-y-1">
        <p>© {new Date().getFullYear()} MCTechnology LLC · MCT PathAI</p>
        <p>
          <a href="mailto:connect@theteammc.com" className="hover:text-slate-300 transition-colors">
            📧 connect@theteammc.com
          </a>
          {" · "}
          <a href="tel:+12065528424" className="hover:text-slate-300 transition-colors">
            📱 +1 (206) 552-8424
          </a>
        </p>
      </footer>
    </main>
  );
}
