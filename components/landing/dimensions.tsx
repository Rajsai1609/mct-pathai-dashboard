const DIMENSIONS = [
  {
    icon: "🎯",
    name: "Skill Match",
    desc: "Jaccard overlap between your resume skills and the job's requirements",
  },
  {
    icon: "📊",
    name: "Experience Level",
    desc: "Years of experience aligned to the role's seniority band",
  },
  {
    icon: "📍",
    name: "Location Match",
    desc: "USA geography gate — remote, hybrid, or your target city",
  },
  {
    icon: "🛡️",
    name: "Visa Compatibility",
    desc: "H1B / OPT / STEM OPT sponsorship verified before you ever see the job",
  },
  {
    icon: "🧠",
    name: "Semantic Relevance",
    desc: "Sentence-transformer embeddings measure deep contextual similarity",
  },
  {
    icon: "💼",
    name: "Job Category",
    desc: "Role type matched to your target function — SWE, data, ML, product",
  },
  {
    icon: "🏢",
    name: "Company Fit",
    desc: "Company stage, size, and culture signals scored against your profile",
  },
  {
    icon: "🏭",
    name: "Industry Alignment",
    desc: "Domain match between your background and the company's sector",
  },
  {
    icon: "💰",
    name: "Salary Range",
    desc: "Compensation band compared to your stated target range",
  },
  {
    icon: "📄",
    name: "Resume Alignment",
    desc: "Full semantic comparison of your resume text against the job description",
  },
];

export function Dimensions() {
  return (
    <section className="py-24 container mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">
          How We Score
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
          10-Dimensional AI Matching
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Most job platforms match on 1–2 keywords.{" "}
          <span className="text-slate-200 font-medium">
            We score every job across 10 dimensions.
          </span>
        </p>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto mb-14">
        {DIMENSIONS.map((d, i) => (
          <div
            key={i}
            className="glass rounded-xl p-5 border border-white/8 group relative overflow-hidden
                       transition-all duration-200
                       hover:border-violet-500/40
                       hover:shadow-[0_0_28px_rgba(124,58,237,0.2)]"
          >
            {/* Hover glow layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-violet-600/0 group-hover:from-violet-600/8 group-hover:to-transparent transition-all duration-200 pointer-events-none rounded-xl" />

            {/* Number badge */}
            <span className="absolute top-3 right-3 text-[10px] font-bold text-violet-400/60 bg-violet-500/10 rounded-full w-5 h-5 flex items-center justify-center border border-violet-500/20">
              {i + 1}
            </span>

            <span className="text-2xl mb-3 block">{d.icon}</span>
            <p className="text-white font-semibold text-sm mb-1.5">{d.name}</p>
            <p className="text-slate-500 text-xs leading-relaxed">{d.desc}</p>
          </div>
        ))}
      </div>

      {/* Bottom callout */}
      <div className="max-w-2xl mx-auto text-center glass rounded-2xl p-6 border border-violet-500/20 bg-violet-500/5">
        <p className="text-slate-300 leading-relaxed">
          Every job gets a single unified score combining all 10 dimensions —
          so you always see{" "}
          <span className="text-violet-300 font-semibold">
            YOUR best matches first.
          </span>
        </p>
      </div>
    </section>
  );
}
