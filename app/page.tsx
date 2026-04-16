import { Suspense } from "react";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { StatsSection } from "@/components/landing/stats-section";
import { StudentsSection } from "@/components/landing/students-section";
import { CtaSection } from "@/components/landing/cta-section";

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
          <span className="text-slate-500 text-sm">Powered by MCTechnology LLC</span>
        </div>
      </nav>

      <div className="pt-14">
        <Hero />
        <StatsSection />
        <HowItWorks />
        <Suspense fallback={<StudentsSkeleton />}>
          <StudentsSection />
        </Suspense>
        <CtaSection />
      </div>

      <footer className="border-t border-white/5 py-8 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} MCTechnology LLC · MCT PathAI
      </footer>
    </main>
  );
}
