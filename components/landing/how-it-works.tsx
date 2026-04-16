import { FileText, Brain, Briefcase } from "lucide-react";

const STEPS = [
  {
    icon: FileText,
    number: "01",
    title: "Upload Your Resume",
    description:
      "Share your resume once. Our AI extracts your skills, experience level, and preferences automatically.",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: Brain,
    number: "02",
    title: "AI Scoring Engine",
    description:
      "We scrape 5,000+ jobs daily and score each one against your profile using semantic AI and skill matching.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Briefcase,
    number: "03",
    title: "Get Ranked Matches",
    description:
      "View your personalized job feed sorted by match score. Every role is pre-filtered for visa compatibility.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 container mx-auto px-6">
      <div className="text-center mb-16">
        <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">
          The Process
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          How MCT PathAI Works
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          From resume to ranked job list in minutes — fully automated.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {STEPS.map((step, i) => (
          <div key={i} className={`glass glass-hover rounded-2xl p-8 border ${step.bg} relative`}>
            <span className="absolute top-6 right-6 text-4xl font-black text-white/5 select-none">
              {step.number}
            </span>
            <div className={`inline-flex p-3 rounded-xl ${step.bg} border mb-5`}>
              <step.icon className={`w-6 h-6 ${step.color}`} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
            <p className="text-slate-400 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
