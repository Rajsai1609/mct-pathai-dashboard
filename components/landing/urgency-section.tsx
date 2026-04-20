const STATS = [
  {
    icon: "🔥",
    headline: "200+ Applications",
    sub: "Average OPT student applies to 200+ jobs before landing an interview — most to companies that don't sponsor.",
    border: "border-red-500/20",
    bg: "bg-red-500/5",
    color: "text-red-400",
  },
  {
    icon: "⏰",
    headline: "365 Days of OPT",
    sub: "Your OPT window closes fast. Every week spent on the wrong applications is a week you can't get back.",
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
    color: "text-amber-400",
  },
  {
    icon: "💸",
    headline: "Wrong Company = Wasted Months",
    sub: "Interviewing at a non-sponsor wastes 4–8 weeks. One bad choice can cost you your entire OPT window.",
    border: "border-orange-500/20",
    bg: "bg-orange-500/5",
    color: "text-orange-400",
  },
  {
    icon: "🎯",
    headline: "5× Faster with MCT PathAI",
    sub: "Students using AI-matched, visa-verified job lists reach interviews 5× faster than those scrolling LinkedIn.",
    border: "border-violet-500/20",
    bg: "bg-violet-500/5",
    color: "text-violet-400",
  },
];

export function UrgencySection() {
  return (
    <section className="py-24 bg-gray-900/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
            The Cost of Waiting
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Every Day Without MCT PathAI Costs You Time
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            The job market moves fast. Your visa clock moves faster.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {STATS.map((s) => (
            <div
              key={s.headline}
              className={`glass rounded-2xl p-6 border ${s.border} ${s.bg} flex flex-col gap-3`}
            >
              <span className="text-3xl">{s.icon}</span>
              <h3 className={`font-bold text-base ${s.color}`}>{s.headline}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
