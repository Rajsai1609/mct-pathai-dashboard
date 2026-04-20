import { Suspense } from "react";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Dimensions } from "@/components/landing/dimensions";
import { ValueProps } from "@/components/landing/value-props";
import { StatsSection } from "@/components/landing/stats-section";
import { StudentsSection } from "@/components/landing/students-section";
import { CtaSection } from "@/components/landing/cta-section";
import { ContactSection } from "@/components/landing/contact-section";
import { FreshnessSection } from "@/components/landing/freshness-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { VideoDemoSection } from "@/components/landing/video-demo-section";
import { FAQSection } from "@/components/landing/faq-section";
import { ComparisonSection } from "@/components/landing/comparison-section";
import { PainPointsSection } from "@/components/landing/pain-points-section";
import { UrgencySection } from "@/components/landing/urgency-section";
import { DemoDashboardsSection } from "@/components/landing/demo-dashboards-section";
import { DashboardPreviewBanner } from "@/components/landing/dashboard-preview-banner";
import { fetchJobCount, fetchStudentCount } from "@/lib/supabase";

export const revalidate = 300; // revalidate every 5 minutes

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

export default async function HomePage() {
  const [studentCount, jobCount] = await Promise.all([
    fetchStudentCount(),
    fetchJobCount(),
  ]);
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
        <Hero jobCount={jobCount} />

        {/* 2 — Hero stats */}
        <StatsSection />

        {/* 4 — Pain points */}
        <PainPointsSection />

        {/* 5 — How it works */}
        <HowItWorks />

        {/* 6 — Live beta dashboards */}
        <DemoDashboardsSection />

        {/* 7 — Student testimonials */}
        <TestimonialsSection />

        {/* 7 — Video demo */}
        <VideoDemoSection />

        {/* 8 — 10-dimensional AI matching */}
        <Dimensions />

        {/* 9 — Built only for international students */}
        <ValueProps />

        {/* 10 — MCT PathAI vs LinkedIn */}
        <ComparisonSection />

        {/* 11 — How fresh are our jobs */}
        <FreshnessSection />

        {/* 12 — Cost of waiting */}
        <UrgencySection />

        {/* 13 — Live student dashboards */}
        <Suspense fallback={<StudentsSkeleton />}>
          <StudentsSection />
        </Suspense>

        {/* 14 — FAQ */}
        <FAQSection />

        {/* 15 — Dashboard preview banner */}
        <section className="py-16 container mx-auto px-6">
          <DashboardPreviewBanner />
        </section>

        {/* 16 — Stop Waiting. Start Matching. */}
        <CtaSection studentCount={studentCount} />

        {/* 16 — Contact */}
        <ContactSection />
      </div>

      <footer className="border-t border-white/5 py-8 text-center text-slate-500 text-sm space-y-2">
        <p>© {new Date().getFullYear()} MCTechnology LLC · MCT PathAI</p>
        <p className="flex items-center justify-center flex-wrap gap-4">
          <a href="mailto:connect@theteammc.com" className="hover:text-slate-300 transition-colors">
            📧 connect@theteammc.com
          </a>
          <a href="tel:+12065528424" className="hover:text-slate-300 transition-colors">
            📱 +1 (206) 552-8424
          </a>
          <a
            href="https://www.linkedin.com/company/106539005/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-blue-400 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
        </p>
      </footer>
    </main>
  );
}
